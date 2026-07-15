import { NextResponse, type NextRequest } from "next/server";
import { db, albumsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { albumSchema } from "@/lib/admin-schemas";

// PUT/DELETE /api/admin/albums/[id] — admin (middleware-gated). Featured cap verbatim.
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = Number((await params).id);
    if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    const parsed = albumSchema.partial().safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    const data = parsed.data as Record<string, unknown>;
    if (data.featured === true) {
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(albumsTable)
        .where(eq(albumsTable.featured, true));
      if (count >= 4) {
        const [current] = await db.select({ featured: albumsTable.featured }).from(albumsTable).where(eq(albumsTable.id, id));
        if (!current?.featured) {
          return NextResponse.json({ error: "Ya hay 4 featured works. Desmarca uno antes de marcar otro." }, { status: 400 });
        }
      }
    }
    await db.update(albumsTable).set(data).where(eq(albumsTable.id, id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error updating album:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = Number((await params).id);
    if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    await db.delete(albumsTable).where(eq(albumsTable.id, id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error deleting album:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
