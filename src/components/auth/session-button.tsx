import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { signOut } from "@/app/sign-out/actions";
import { Button } from "@/components/ui/button";

export async function SessionButton() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="flex gap-2">
        <Button asChild variant="ghost">
          <Link href="/sign-in">Sign in</Link>
        </Button>
        <Button asChild>
          <Link href="/trips">Start</Link>
        </Button>
      </div>
    );
  }

  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button asChild variant="ghost">
          <Link href="/sign-in">Sign in</Link>
        </Button>
        <Button asChild>
          <Link href="/trips">Start</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-muted-foreground sm:inline">
        {user.email}
      </span>
      <form action={signOut}>
        <Button type="submit" variant="ghost">
          Sign out
        </Button>
      </form>
    </div>
  );
}
