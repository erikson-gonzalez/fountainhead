import { db, productsTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { ShopClient, type ProductView } from "./shop-client";

// §1: Split — category filter + add-to-cart are client state. Server fetches
// products via Drizzle (featured desc, priceEur numeric→number as in GET
// /api/products); the client filters by category in-memory + handles the cart.
export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const rows = await db.select().from(productsTable).orderBy(desc(productsTable.featured));
  const products: ProductView[] = rows.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    priceEur: Number(p.priceEur),
    category: p.category,
    imageUrl: p.imageUrl ?? null,
    digital: p.digital,
    deliveryType: p.deliveryType ?? null,
  }));

  return <ShopClient products={products} />;
}
