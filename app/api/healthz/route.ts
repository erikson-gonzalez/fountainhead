import { NextResponse } from "next/server";

// GET /api/healthz — public health check.
export async function GET() {
  return NextResponse.json({ status: "ok" });
}
