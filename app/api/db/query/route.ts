
import { NextRequest, NextResponse } from "next/server";

const base = process.env.PIXELDB_API_URL;
const key = process.env.PIXELDB_API_KEY as string;

export async function POST(req: NextRequest) {
  const { collection, opts } = await req.json();

  const payload = {
    action: "query",
    collection,
    options: opts || {},
  };

  const res = await fetch(`${base}/ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
    body: JSON.stringify({ data: payload }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    return new NextResponse(text, { status: res.status });
  }
  const json = await res.json();
  const items = Array.isArray(json?.data) ? json.data : (json?.items || []);
  return NextResponse.json(items);
}
