import { NextResponse } from "next/server";
import { db, albumsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

// GET /api/albums/[id] — public.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const [album] = await db.select().from(albumsTable).where(eq(albumsTable.id, id));
    if (!album) return NextResponse.json({ error: "Album not found" }, { status: 404 });

    return NextResponse.json({ ...album, coverUrl: album.coverUrl ?? null, description: album.description ?? null });
  } catch (err) {
    console.error("Error fetching album:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
