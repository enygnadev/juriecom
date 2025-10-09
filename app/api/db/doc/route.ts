
import { NextRequest, NextResponse } from "next/server";

const base = process.env.PIXELDB_API_URL;
const key = process.env.PIXELDB_API_KEY as string;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const collection = searchParams.get("collection");
  const id = searchParams.get("id");

  const payload = { action: "get", collection, id };
  const res = await fetch(`${base}/ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
    body: JSON.stringify({ data: payload }),
    cache: "no-store",
  });

  if (!res.ok) return new NextResponse(await res.text(), { status: res.status });
  const json = await res.json();
  return NextResponse.json(json?.data ?? null);
}

export async function PUT(req: NextRequest) {
  const { collection, id, data } = await req.json();

  const payload = { action: "upsert", collection, id, data };
  const res = await fetch(`${base}/ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
    body: JSON.stringify({ data: payload }),
    cache: "no-store",
  });

  if (!res.ok) return new NextResponse(await res.text(), { status: res.status });
  const json = await res.json();
  return NextResponse.json({ id: json?.id || id });
}

export async function PATCH(req: NextRequest) {
  const { collection, id, patch } = await req.json();

  const payload = { action: "update", collection, id, patch };
  const res = await fetch(`${base}/ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
    body: JSON.stringify({ data: payload }),
    cache: "no-store",
  });

  if (!res.ok) return new NextResponse(await res.text(), { status: res.status });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const collection = searchParams.get("collection");
  const id = searchParams.get("id");

  const payload = { action: "delete", collection, id };
  const res = await fetch(`${base}/ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
    body: JSON.stringify({ data: payload }),
    cache: "no-store",
  });

  if (!res.ok) return new NextResponse(await res.text(), { status: res.status });
  return NextResponse.json({ ok: true });
}
