// All service types supported by quote API — must match services page categories.
// Kept out of quote-client.tsx (a "use client" module): non-component exports
// from a client file become opaque references when imported into a Server
// Component, breaking .includes() at runtime — see app/(public)/quote/page.tsx.
export const SERVICE_TYPES = ["mixing", "mastering", "stem-mastering", "production", "mixing-mastering", "string-arrangement", "cowriting", "guitar-solo"] as const;
