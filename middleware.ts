import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth/config";

// Edge-runtime auth built from the edge-safe config (no db/bcrypt in this bundle).
const { auth } = NextAuth(authConfig);

/** Unauthenticated → 401; authenticated but wrong role → 403. */
function denyApi(isAuthenticated: boolean): NextResponse {
  const status = isAuthenticated ? 403 : 401;
  return NextResponse.json(
    { error: status === 401 ? "Unauthorized" : "Forbidden" },
    { status },
  );
}

export default auth((req) => {
  const { nextUrl } = req;
  const path = nextUrl.pathname;
  const session = req.auth;
  const role = session?.user?.role;

  const isAdminLogin = path === "/tomfountainhead-admin/login";
  const isAdminPage = path.startsWith("/tomfountainhead-admin") && !isAdminLogin;
  const isAdminApi = path.startsWith("/api/admin");
  const isPortalPage = path === "/portal";
  const isPortalApi =
    path.startsWith("/api/portal/lessons") || path.startsWith("/api/portal/resources");

  // Admin area — role must be exactly "admin", never interchangeable with portal.
  if (isAdminPage || isAdminApi) {
    if (role !== "admin") {
      if (isAdminApi) return denyApi(Boolean(session));
      const loginUrl = new URL("/tomfountainhead-admin/login", nextUrl);
      loginUrl.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Portal area — role must be exactly "portal". /portal-access stays public
  // (it is the request-access / sign-in entry point) and /api/portal/access too.
  if (isPortalPage || isPortalApi) {
    if (role !== "portal") {
      if (isPortalApi) return denyApi(Boolean(session));
      return NextResponse.redirect(new URL("/portal-access", nextUrl));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/tomfountainhead-admin",
    "/tomfountainhead-admin/:path*",
    "/api/admin/:path*",
    "/portal",
    "/api/portal/lessons/:path*",
    "/api/portal/resources/:path*",
  ],
};
