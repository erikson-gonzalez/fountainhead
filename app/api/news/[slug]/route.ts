import { NextResponse } from "next/server";
import { db, newsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

// GET /api/news/[slug] — public.
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const [post] = await db.select().from(newsTable).where(eq(newsTable.slug, slug));
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    return NextResponse.json({
      ...post,
      excerpt: post.excerpt ?? null,
      imageUrl: post.imageUrl ?? null,
      publishedAt: post.publishedAt.toISOString(),
    });
  } catch (err) {
    console.error("Error fetching news post:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
