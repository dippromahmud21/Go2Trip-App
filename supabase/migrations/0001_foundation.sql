create extension if not exists "pgcrypto";

create type public.trip_role as enum ('owner', 'editor', 'viewer');
create type public.invitation_status as enum ('invited', 'previewing', 'accepted');
create type public.itinerary_item_kind as enum ('flight', 'hotel', 'activity', 'meal', 'transport', 'note');
create type public.import_source as enum ('gmail', 'google_calendar', 'pdf', 'screenshot', 'pasted_text');
create type public.import_status as enum ('queued', 'parsed', 'needs_review', 'accepted', 'failed');
create type public.expense_split_type as enum ('equal', 'custom_amounts');

create table public.trips (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  destination text not null default '',
  starts_on date,
  ends_on date,
  default_currency char(3) not null default 'USD',
  cover_image_url text,
  share_slug text unique not null default encode(gen_random_bytes(12), 'hex'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.trip_participants (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  display_name text not null,
  email text,
  role public.trip_role not null default 'viewer',
  invitation_status public.invitation_status not null default 'invited',
  created_at timestamptz not null default now(),
  unique (trip_id, user_id),
  unique (trip_id, email)
);

create table public.itinerary_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  kind public.itinerary_item_kind not null default 'note',
  title text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  location_name text,
  notes text,
  source_import_id uuid,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.exchange_rate_snapshots (
  id uuid primary key default gen_random_uuid(),
  base_currency char(3) not null,
  quote_currency char(3) not null,
  rate numeric(18, 8) not null,
  provider text not null,
  captured_at timestamptz not null default now()
);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  title text not null,
  paid_by_participant_id uuid not null references public.trip_participants(id),
  amount_minor bigint not null check (amount_minor > 0),
  currency char(3) not null,
  trip_amount_minor bigint not null check (trip_amount_minor > 0),
  trip_currency char(3) not null,
  exchange_rate_snapshot_id uuid references public.exchange_rate_snapshots(id),
  split_type public.expense_split_type not null,
  incurred_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.expense_shares (
  id uuid primary key default gen_random_uuid(),
  expense_id uuid not null references public.expenses(id) on delete cascade,
  participant_id uuid not null references public.trip_participants(id) on delete cascade,
  amount_minor bigint not null check (amount_minor >= 0),
  unique (expense_id, participant_id)
);

create table public.import_jobs (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references public.trips(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  source public.import_source not null,
  status public.import_status not null default 'queued',
  source_name text,
  storage_path text,
  raw_text text,
  parsed_payload jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.google_import_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  google_subject text,
  scope text not null,
  encrypted_access_token text not null,
  encrypted_refresh_token text,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

create or replace function public.is_trip_member(target_trip_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.trip_participants
    where trip_id = target_trip_id
      and user_id = auth.uid()
      and invitation_status = 'accepted'
  );
$$;

create or replace function public.can_edit_trip(target_trip_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.trip_participants
    where trip_id = target_trip_id
      and user_id = auth.uid()
      and role in ('owner', 'editor')
      and invitation_status = 'accepted'
  );
$$;

alter table public.trips enable row level security;
alter table public.trip_participants enable row level security;
alter table public.itinerary_items enable row level security;
alter table public.expenses enable row level security;
alter table public.expense_shares enable row level security;
alter table public.import_jobs enable row level security;
alter table public.google_import_connections enable row level security;
alter table public.exchange_rate_snapshots enable row level security;

create policy "members can read trips"
on public.trips for select
using (owner_id = auth.uid() or public.is_trip_member(id));

create policy "authenticated users can create trips"
on public.trips for insert
with check (owner_id = auth.uid());

create policy "owners and editors can update trips"
on public.trips for update
using (owner_id = auth.uid() or public.can_edit_trip(id));

create policy "members can read participants"
on public.trip_participants for select
using (public.is_trip_member(trip_id) or user_id = auth.uid());

create policy "editors can manage participants"
on public.trip_participants for all
using (
  public.can_edit_trip(trip_id)
  or exists (
    select 1 from public.trips
    where trips.id = trip_participants.trip_id
      and trips.owner_id = auth.uid()
  )
)
with check (
  public.can_edit_trip(trip_id)
  or exists (
    select 1 from public.trips
    where trips.id = trip_participants.trip_id
      and trips.owner_id = auth.uid()
  )
);

create policy "members can read itinerary"
on public.itinerary_items for select
using (public.is_trip_member(trip_id));

create policy "editors can manage itinerary"
on public.itinerary_items for all
using (public.can_edit_trip(trip_id))
with check (public.can_edit_trip(trip_id));

create policy "members can read expenses"
on public.expenses for select
using (public.is_trip_member(trip_id));

create policy "editors can manage expenses"
on public.expenses for all
using (public.can_edit_trip(trip_id))
with check (public.can_edit_trip(trip_id));

create policy "members can read expense shares"
on public.expense_shares for select
using (
  exists (
    select 1 from public.expenses
    where expenses.id = expense_shares.expense_id
      and public.is_trip_member(expenses.trip_id)
  )
);

create policy "editors can manage expense shares"
on public.expense_shares for all
using (
  exists (
    select 1 from public.expenses
    where expenses.id = expense_shares.expense_id
      and public.can_edit_trip(expenses.trip_id)
  )
)
with check (
  exists (
    select 1 from public.expenses
    where expenses.id = expense_shares.expense_id
      and public.can_edit_trip(expenses.trip_id)
  )
);

create policy "users can manage own google import connections"
on public.google_import_connections for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "members can read imports"
on public.import_jobs for select
using (trip_id is null or public.is_trip_member(trip_id));

create policy "editors can manage imports"
on public.import_jobs for all
using (trip_id is null or public.can_edit_trip(trip_id))
with check (trip_id is null or public.can_edit_trip(trip_id));

create policy "members can read exchange snapshots"
on public.exchange_rate_snapshots for select
to authenticated
using (true);
