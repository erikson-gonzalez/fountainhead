import { db, bookOfferingsTable } from "@workspace/db";
import { BookClient, type BookView } from "./book-client";

// §1: Split — service selection + contact form + cart are client state. Server
// fetches offerings via Drizzle (sortOrder,id; priceEur numeric→number, as in
// GET /api/books) and passes them to the client.
export const dynamic = "force-dynamic";

export default async function BookPage() {
  const rows = await db
    .select()
    .from(bookOfferingsTable)
    .orderBy(bookOfferingsTable.sortOrder, bookOfferingsTable.id);

  const books: BookView[] = rows.map((b) => ({
    id: b.id,
    name: b.name,
    description: b.description,
    priceEur: Number(b.priceEur),
    unit: b.unit,
    tag: b.tag,
    icon: b.icon,
    imageUrl: b.imageUrl,
    linkType: b.linkType,
  }));

  return <BookClient books={books} />;
}
