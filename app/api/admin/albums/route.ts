import { NextResponse, type NextRequest } from "next/server";
import { db, albumsTable } from "@workspace/db";
import { desc, eq, sql } from "drizzle-orm";
import { albumSchema } from "@/lib/admin-schemas";

// GET/POST /api/admin/albums — admin (middleware-gated). Featured cap = 4, verbatim.

export async function GET() {
  try {
    const rows = await db.select().from(albumsTable).orderBy(desc(albumsTable.createdAt), desc(albumsTable.id));
    return NextResponse.json({ albums: rows });
  } catch (err) {
    console.error("Error listing albums:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const parsed = albumSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;
    if (data.featured) {
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(albumsTable)
        .where(eq(albumsTable.featured, true));
      if (count >= 4) {
        return NextResponse.json({ error: "Ya hay 4 featured works. Desmarca uno antes de añadir otro." }, { status: 400 });
      }
    }
    const [row] = await db
      .insert(albumsTable)
      .values({
        artist: data.artist,
        title: data.title,
        releaseDate: data.releaseDate ?? "1900-01-01",
        role: data.role,
        roleType: data.roleType,
        genre: data.genre,
        coverUrl: data.coverUrl ?? null,
        spotifyEmbedUrl: data.spotifyEmbedUrl ?? null,
        description: data.description ?? null,
        featured: data.featured ?? false,
      })
      .returning({ id: albumsTable.id });
    return NextResponse.json({ ok: true, id: row?.id });
  } catch (err) {
    console.error("Error creating album:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
