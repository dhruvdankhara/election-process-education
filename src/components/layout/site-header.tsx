import Link from "next/link";
import { auth, signOut } from "@/core/auth/auth";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/layout/main-nav";
import { LayoutDashboard, LogIn, UserPlus, LogOut } from "lucide-react";

export async function SiteHeader() {
  const session = await auth();
  const isLoggedIn = !!session?.user?.id;
  const isAdmin = session?.user?.role === "admin";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-2 md:gap-6">
          {/* Mobile Nav is inside MainNav */}
          <Link href="/" className="hidden items-center gap-2 md:flex">
            <span className="text-lg font-bold tracking-tight text-foreground">VoteWise Guide</span>
          </Link>
          <MainNav isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
        </div>

        <div className="flex items-center gap-3">
          {!session && (
            <>
              <Button asChild size="sm" variant="ghost" className="hidden sm:flex">
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" aria-hidden="true" />
                  Log in
                </Link>
              </Button>
              <Button asChild size="sm" className="rounded-full shadow-sm">
                <Link href="/register">
                  <UserPlus className="mr-2 h-4 w-4 hidden sm:inline-block" aria-hidden="true" />
                  Get started
                </Link>
              </Button>
            </>
          )}

          {session && (
            <>
              <Button asChild size="sm" variant="outline" className="hidden sm:flex rounded-full">
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" aria-hidden="true" />
                  Dashboard
                </Link>
              </Button>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <Button size="sm" variant="secondary" type="submit" className="rounded-full">
                  <LogOut className="mr-2 h-4 w-4 hidden sm:inline-block" aria-hidden="true" />
                  Sign out
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
