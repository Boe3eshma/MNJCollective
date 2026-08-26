import { getStore } from "@netlify/blobs";

const ORDER_PREFIX = "order:";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, x-admin-secret",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
};

function isAdmin(req) {
  const secret = req.headers.get("x-admin-secret");
  return Boolean(process.env.ADMIN_SECRET) && secret === process.env.ADMIN_SECRET;
}

// Genereert een uniek bestelnummer server-side. Dit voorkomt dubbele nummers
// bij (bijna) gelijktijdige bestellingen — iets wat puur client-side (zoals
// in de eerdere Claude-artifact-versie) niet waterdicht af te dwingen was.
async function generateUniqueOrderNumber(store) {
  const year = new Date().getFullYear();
  for (let i = 0; i < 8; i++) {
    const candidate = `TCG-${year}-${String(Math.floor(100000 + Math.random() * 900000))}`;
    const existing = await store.get(ORDER_PREFIX + candidate);
    if (existing === null) return candidate;
  }
  return `TCG-${year}-${Date.now().toString().slice(-6)}`;
}

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const store = getStore("tcghaven");

  // GET: alle bestellingen ophalen — alléén voor de beheerder, want dit
  // bevat persoonsgegevens (naam, adres, telefoon, e-mail).
  if (req.method === "GET") {
    if (!isAdmin(req)) {
      return Response.json({ error: "Unauthorized" }, { status: 401, headers: CORS_HEADERS });
    }
    const { blobs } = await store.list({ prefix: ORDER_PREFIX });
    const orders = await Promise.all(blobs.map((b) => store.get(b.key, { type: "json" })));
    const cleaned = orders.filter(Boolean).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return Response.json(cleaned, { headers: CORS_HEADERS });
  }

  // POST: nieuw bestelverzoek plaatsen — publiek toegankelijk, dit is de
  // klant die een bestelling doet. Server bepaalt bestelnummer + datum.
  if (req.method === "POST") {
    let draft;
    try {
      draft = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400, headers: CORS_HEADERS });
    }

    // Basisvalidatie server-side, als aanvulling op de client-side validatie.
    if (
      !draft ||
      !draft.customer ||
      !draft.customer.name ||
      !draft.customer.email ||
      !Array.isArray(draft.items) ||
      draft.items.length === 0
    ) {
      return Response.json({ error: "Missing required fields" }, { status: 400, headers: CORS_HEADERS });
    }

    const orderNumber = await generateUniqueOrderNumber(store);
    const fullOrder = { ...draft, orderNumber, createdAt: new Date().toISOString() };
    await store.setJSON(ORDER_PREFIX + orderNumber, fullOrder);
    return Response.json(fullOrder, { headers: CORS_HEADERS });
  }

  // PATCH: ofwel de bestelstatus wijzigen (alléén admin), ofwel het
  // e-mailstatus-veld bijwerken (mag altijd — gebeurt direct na de eigen
  // checkout-poging van de klant, vóórdat die klant "admin" is).
  if (req.method === "PATCH") {
    let payload;
    try {
      payload = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400, headers: CORS_HEADERS });
    }
    const { orderNumber } = payload || {};
    if (!orderNumber) {
      return Response.json({ error: "Missing orderNumber" }, { status: 400, headers: CORS_HEADERS });
    }
    const existing = await store.get(ORDER_PREFIX + orderNumber, { type: "json" });
    if (!existing) {
      return Response.json({ error: "Order not found" }, { status: 404, headers: CORS_HEADERS });
    }

    if (Object.prototype.hasOwnProperty.call(payload, "orderStatus")) {
      if (!isAdmin(req)) {
        return Response.json({ error: "Unauthorized" }, { status: 401, headers: CORS_HEADERS });
      }
      existing.orderStatus = payload.orderStatus;
    }
    if (Object.prototype.hasOwnProperty.call(payload, "emailStatus")) {
      existing.emailStatus = payload.emailStatus;
    }

    await store.setJSON(ORDER_PREFIX + orderNumber, existing);
    return Response.json(existing, { headers: CORS_HEADERS });
  }

  return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
};

export const config = { path: "/api/orders" };
