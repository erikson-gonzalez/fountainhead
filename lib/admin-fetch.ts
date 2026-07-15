/**
 * Drop-in replacement for the old admin-auth-store `adminFetch`.
 *
 * Admin API routes (/api/admin/*) are now protected by NextAuth session
 * cookies + middleware.ts (role === "admin"), not by a bearer token. Cookies
 * are sent automatically on same-origin requests, so this is a thin fetch
 * wrapper kept only to preserve the call sites' signature.
 */
export function adminFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(path, init);
}
