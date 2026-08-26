import { getStore } from "@netlify/blobs";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, x-admin-secret",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const MAX_BYTES = 5 * 1024 * 1024; // 5MB per afbeelding
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function isAdmin(req) {
  const secret = req.headers.get("x-admin-secret");
  return Boolean(process.env.ADMIN_SECRET) && secret === process.env.ADMIN_SECRET;
}

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const store = getStore("tcghaven-images");
  const url = new URL(req.url);

  // POST: nieuwe afbeelding uploaden — alleen voor de beheerder.
  // Verwacht de ruwe bestandsbytes in de body, met Content-Type header.
  if (req.method === "POST") {
    if (!isAdmin(req)) {
      return Response.json({ error: "Unauthorized" }, { status: 401, headers: CORS_HEADERS });
    }
    const contentType = req.headers.get("content-type") || "";
    if (!ALLOWED_TYPES.includes(contentType)) {
      return Response.json(
        { error: "Alleen JPEG, PNG, WEBP of GIF toegestaan" },
        { status: 400, headers: CORS_HEADERS }
      );
    }
    const bytes = await req.arrayBuffer();
    if (bytes.byteLength === 0) {
      return Response.json({ error: "Lege upload" }, { status: 400, headers: CORS_HEADERS });
    }
    if (bytes.byteLength > MAX_BYTES) {
      return Response.json({ error: "Afbeelding is groter dan 5MB" }, { status: 400, headers: CORS_HEADERS });
    }

    const ext = contentType.split("/")[1].replace("jpeg", "jpg");
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;

    await store.set(id, bytes, { metadata: { contentType } });

    return Response.json({ url: `/api/images/${id}` }, { headers: CORS_HEADERS });
  }

  // GET: een opgeslagen afbeelding tonen — publiek, dit zijn de productfoto's
  // die klanten in de catalogus zien. Verwacht /api/images/<bestandsnaam>.
  if (req.method === "GET") {
    const id = decodeURIComponent(url.pathname.replace(/^\/api\/images\//, ""));
    if (!id) {
      return Response.json({ error: "Missing image id" }, { status: 400, headers: CORS_HEADERS });
    }
    const result = await store.getWithMetadata(id, { type: "arrayBuffer" });
    if (!result) {
      return new Response("Not found", { status: 404, headers: CORS_HEADERS });
    }
    const contentType = result.metadata?.contentType || "application/octet-stream";
    return new Response(result.data, {
      headers: {
        ...CORS_HEADERS,
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
};

export const config = { path: "/api/images/*" };
