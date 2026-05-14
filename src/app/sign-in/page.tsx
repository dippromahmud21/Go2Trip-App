import { Mail } from "lucide-react";
import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/brand/brand-logo";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Button } from "@/components/ui/button";
import { signInWithEmail, signInWithGoogle } from "@/app/sign-in/actions";

type SignInPageProps = {
  searchParams?: Promise<{
    error?: string;
    sent?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  if (!isSupabaseConfigured()) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <BrandLogo className="h-16" priority />
          <h1 className="text-title-md mt-5 text-[hsl(var(--brand-purple-deep))]">
            Connect Supabase
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
            to your local environment before enabling authentication.
          </p>
        </div>
      </main>
    );
  }

  const [params, user] = await Promise.all([searchParams, getCurrentUser()]);

  if (user) {
    redirect("/trips");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <BrandLogo className="h-16" priority />
        <h1 className="text-title-md mt-5 text-[hsl(var(--brand-purple-deep))]">
          Sign in
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Use email or Google to join shared trips and collaborate with your
          group.
        </p>
        {params?.sent === "1" ? (
          <div className="mt-5 rounded-md border bg-[hsl(var(--brand-orange-soft))] px-4 py-3 text-sm text-[hsl(var(--foreground))]">
            Check your inbox for a sign-in link.
          </div>
        ) : null}
        {params?.error ? (
          <div className="mt-5 rounded-md border border-[hsl(var(--destructive))] bg-white px-4 py-3 text-sm text-[hsl(var(--destructive))]">
            {decodeURIComponent(params.error)}
          </div>
        ) : null}
        <form action={signInWithEmail} className="mt-6 space-y-3">
          <label className="block text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))]"
            id="email"
            name="email"
            placeholder="you@example.com"
            required
            type="email"
          />
          <Button className="w-full" type="submit">
            <Mail className="h-4 w-4" />
            Send sign-in link
          </Button>
        </form>
        <form action={signInWithGoogle} className="mt-3">
          <Button className="w-full" variant="secondary" type="submit">
            Continue with Google
          </Button>
        </form>
      </div>
    </main>
  );
}
