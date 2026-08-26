import { getStore } from "@netlify/blobs";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, x-admin-secret",
  "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
};

// Voorbeeldproducten waarmee de catalogus wordt gevuld zodra er nog niets in
// de opslag staat (eenmalige server-side bootstrap, zie GET hieronder).
// Dit is dezelfde set als in src/App.jsx — pas je hier niets aan, bewerk
// producten gewoon via het adminpaneel zodra de site live staat.
const SEED_PRODUCTS = [
  {
    id: "seed-1",
    name: "Pokémon TCG — Scarlet & Violet Boosterbox",
    shortDescription: "36 boosterpacks, verzegeld, Engelstalige editie.",
    fullDescription:
      "Volledige boosterbox van de Scarlet & Violet basisset. Bevat 36 boosterpacks van elk 10 kaarten, inclusief kans op holo- en full-artkaarten. Geschikt voor verzamelaars en spelers die in één keer een grote hoeveelheid packs willen openen.",
    price: 135,
    category: "Pokémon",
    status: "in_stock",
    expectedDate: "",
    deliveryNote: "",
    imageUrl: "https://placehold.co/600x600/1f1811/ff8a3d?text=Pok%C3%A9mon+TCG",
    visible: true,
    translations: {
      en: {
        shortDescription: "36 booster packs, sealed, English-language edition.",
        fullDescription:
          "Full booster box of the Scarlet & Violet base set. Contains 36 booster packs of 10 cards each, with a chance at holo and full-art cards. Great for collectors and players who want to open a large batch of packs at once.",
      },
      de: {
        shortDescription: "36 Boosterpacks, versiegelt, englischsprachige Edition.",
        fullDescription:
          "Vollständige Booster Box des Scarlet & Violet Grundsets. Enthält 36 Boosterpacks mit je 10 Karten, inklusive Chance auf Holo- und Full-Art-Karten. Geeignet für Sammler und Spieler, die auf einmal eine große Menge Packs öffnen möchten.",
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-2",
    name: "Pokémon TCG — Paldea Evolved Elite Trainer Box",
    shortDescription: "9 boosterpacks + accessoires in Elite Trainer Box.",
    fullDescription:
      "De Elite Trainer Box bevat 9 boosterpacks, een spelmat, kaarthoesjes, energiekaarten, teller-dobbelstenen en een collector's box om alles in te bewaren. Ideaal startpunt voor nieuwe spelers of als aanvulling op een bestaande collectie.",
    price: 54.95,
    category: "Pokémon",
    status: "preorder",
    expectedDate: "Verwacht: oktober 2026",
    deliveryNote: "Pre-order bij de leverancier; datum kan door de leverancier nog wijzigen.",
    imageUrl: "https://placehold.co/600x600/1f1811/ff8a3d?text=Elite+Trainer+Box",
    visible: true,
    translations: {
      en: {
        shortDescription: "9 booster packs + accessories in an Elite Trainer Box.",
        fullDescription:
          "The Elite Trainer Box contains 9 booster packs, a playmat, card sleeves, energy cards, counter dice and a collector's box to store everything in. An ideal starting point for new players or as an addition to an existing collection.",
      },
      de: {
        shortDescription: "9 Boosterpacks + Zubehör in einer Elite Trainer Box.",
        fullDescription:
          "Die Elite Trainer Box enthält 9 Boosterpacks, eine Spielmatte, Kartenhüllen, Energiekarten, Zähler-Würfel und eine Sammlerbox zur Aufbewahrung. Ideal für neue Spieler oder als Ergänzung zu einer bestehenden Sammlung.",
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-3",
    name: "One Piece TCG — OP-09 Booster Box",
    shortDescription: "24 boosterpacks van de OP-09 set, verzegeld.",
    fullDescription:
      "Booster box van OP-09 met 24 packs van elk 12 kaarten. Bevat kans op leaders, alternate arts en SEC-kaarten uit deze set. Verzegeld en ongeopend.",
    price: 120,
    category: "One Piece",
    status: "in_stock",
    expectedDate: "",
    deliveryNote: "",
    imageUrl: "https://placehold.co/600x600/1f1811/ff8a3d?text=One+Piece+TCG",
    visible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-4",
    name: "One Piece TCG — OP-10 Booster Box",
    shortDescription: "Nog niet uitgekomen; alvast te reserveren.",
    fullDescription:
      "Reserveer de nieuwe OP-10 set voordat deze uitkomt. Zodra de set beschikbaar is bij onze leverancier wordt deze ingepland voor verzending. Bij grote drukte kan de levertijd na release oplopen.",
    price: 125,
    category: "One Piece",
    status: "preorder",
    expectedDate: "Verwacht: november 2026",
    deliveryNote: "",
    imageUrl: "https://placehold.co/600x600/1f1811/ff8a3d?text=One+Piece+OP-10",
    visible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-5",
    name: "Disney Lorcana — Shimmering Skies Booster Pack",
    shortDescription: "Losse booster pack, 12 kaarten.",
    fullDescription:
      "Eén boosterpack uit de Shimmering Skies set met 12 kaarten. Leuk om los te proberen of om een bestaande collectie aan te vullen.",
    price: 4.5,
    category: "Lorcana",
    status: "in_stock",
    expectedDate: "",
    deliveryNote: "",
    imageUrl: "https://placehold.co/600x600/1f1811/ff8a3d?text=Lorcana",
    visible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-6",
    name: "Disney Lorcana — Azurite Sea Booster Box",
    shortDescription: "24 packs, wordt speciaal voor je besteld.",
    fullDescription:
      "Deze set houden we niet standaard op voorraad. Bij bestelling plaatsen we een order bij onze leverancier speciaal voor jou. Neem de langere levertijd van on-demand producten in overweging.",
    price: 140,
    category: "Lorcana",
    status: "on_demand",
    expectedDate: "",
    deliveryNote: "On-demand besteld bij leverancier na ontvangst van je bestelverzoek.",
    imageUrl: "https://placehold.co/600x600/1f1811/ff8a3d?text=Azurite+Sea",
    visible: true,
    translations: {
      en: {
        shortDescription: "24 packs, ordered specially for you.",
        fullDescription:
          "We don't keep this set in stock as standard. When you order, we place a request with our supplier specifically for you. Please take the longer lead time of on-demand products into account.",
      },
      de: {
        shortDescription: "24 Packs, wird speziell für dich bestellt.",
        fullDescription:
          "Dieses Set führen wir nicht standardmäßig auf Lager. Bei Bestellung platzieren wir speziell für dich eine Order bei unserem Lieferanten. Bitte beachte die längere Lieferzeit von Produkten auf Anfrage.",
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-7",
    name: "Dragon Ball Super Card Game — Booster Box",
    shortDescription: "24 packs, on-demand besteld.",
    fullDescription:
      "Populaire boosterbox uit de Dragon Ball Super Card Game. Wordt on-demand ingekocht zodra we een bestelverzoek ontvangen.",
    price: 95,
    category: "Dragon Ball",
    status: "on_demand",
    expectedDate: "",
    deliveryNote: "",
    imageUrl: "https://placehold.co/600x600/1f1811/ff8a3d?text=Dragon+Ball+TCG",
    visible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-8",
    name: "Dragon Ball Super Card Game — Starter Deck",
    shortDescription: "Kant-en-klaar startdeck, direct speelklaar.",
    fullDescription:
      "Een compleet startdeck waarmee je direct kunt spelen. Inclusief speluitleg, ideaal voor nieuwe spelers binnen de community.",
    price: 14.95,
    category: "Dragon Ball",
    status: "in_stock",
    expectedDate: "",
    deliveryNote: "",
    imageUrl: "https://placehold.co/600x600/1f1811/ff8a3d?text=Starter+Deck",
    visible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const store = getStore("tcghaven");

  if (req.method === "GET") {
    let data = await store.get("products", { type: "json" });
    if (data === null) {
      // Eerste keer dat de catalogus wordt opgevraagd: zet de voorbeeld-
      // producten klaar zodat de site niet leeg oogt. Overschrijft nooit
      // bestaande data, alleen wanneer er echt nog niets is.
      data = SEED_PRODUCTS;
      await store.setJSON("products", data);
    }
    return Response.json(data, { headers: CORS_HEADERS });
  }

  if (req.method === "PUT") {
    const secret = req.headers.get("x-admin-secret");
    if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
      return Response.json({ error: "Unauthorized" }, { status: 401, headers: CORS_HEADERS });
    }
    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400, headers: CORS_HEADERS });
    }
    if (!Array.isArray(body)) {
      return Response.json({ error: "Expected an array of products" }, { status: 400, headers: CORS_HEADERS });
    }
    await store.setJSON("products", body);
    return Response.json({ ok: true }, { headers: CORS_HEADERS });
  }

  return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
};

export const config = { path: "/api/products" };
