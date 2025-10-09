
import type { DB, QueryOptions } from "../types";

async function api(path: string, init?: RequestInit) {
  const res = await fetch(`/api/db${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`[DB] ${res.status} - ${await res.text()}`);
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

export function createPixelDB(): DB {
  return {
    async getDoc(collection, id) {
      const data = await api(`/doc?collection=${encodeURIComponent(collection)}&id=${encodeURIComponent(id)}`);
      return data || null;
    },
    async list(collection, opts?: QueryOptions) {
      const data = await api(`/query`, { method: "POST", body: JSON.stringify({ collection, opts }) });
      return Array.isArray(data) ? data : (data.items || []);
    },
    async add(collection, payload, id) {
      if (id) {
        await api(`/doc`, { method: "PUT", body: JSON.stringify({ collection, id, data: payload }) });
        return id;
      }
      const created = await api(`/doc`, { method: "PUT", body: JSON.stringify({ collection, data: payload }) });
      return created.id;
    },
    async set(collection, id, payload) {
      await api(`/doc`, { method: "PUT", body: JSON.stringify({ collection, id, data: payload }) });
    },
    async update(collection, id, patch) {
      await api(`/doc`, { method: "PATCH", body: JSON.stringify({ collection, id, patch }) });
    },
    async remove(collection, id) {
      await api(`/doc?collection=${encodeURIComponent(collection)}&id=${encodeURIComponent(id)}`, { method: "DELETE" });
    },
  };
}
