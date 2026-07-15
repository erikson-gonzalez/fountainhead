import { QuoteClient, SERVICE_TYPES } from "./quote-client";

// §1: Split. The only server work is reading the ?service= searchParam (replaces
// the old window.location hack); the multi-step builder + estimate mutation + cart
// live in quote-client. searchParams is async in Next 15.
export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  const preselectedService =
    service && (SERVICE_TYPES as readonly string[]).includes(service) ? service : null;

  return <QuoteClient preselectedService={preselectedService} />;
}
