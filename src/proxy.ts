import { auth } from "@/core/auth/auth";
import { NextResponse } from "next/server";
import { logger } from "@/core/utils/logger";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  try {
    logger.info(
      {
        host: req.headers.get("host"),
        href: nextUrl.href,
        nextauth_env: process.env.NEXTAUTH_URL ?? process.env.AUTH_URL,
      },
      "[auth] incoming request"
    );
  } catch (e) {
    // ignore logging errors in middleware
  }
  const isLoggedIn = !!session?.user?.id;

  const isAuthPage =
    nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");

  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    return NextResponse.next();
  }

  const isApiRoute = nextUrl.pathname.startsWith("/api");
  const isAdminRoute =
    nextUrl.pathname.startsWith("/admin") || nextUrl.pathname.startsWith("/api/v1/admin");
  const isProtectedRoute =
    nextUrl.pathname.startsWith("/dashboard") ||
    nextUrl.pathname.startsWith("/profile") ||
    nextUrl.pathname.startsWith("/simulation") ||
    nextUrl.pathname.startsWith("/learning") ||
    nextUrl.pathname.startsWith("/chat") ||
    nextUrl.pathname.startsWith("/timeline") ||
    isAdminRoute;

  if (isProtectedRoute && !isLoggedIn) {
    if (isApiRoute) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isAdminRoute && session?.user?.role !== "admin") {
    if (isApiRoute) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
