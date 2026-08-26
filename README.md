# MNJCollective — bestel-app (Netlify-versie)

Deze map is een volwaardig, deploybaar project (geen los .jsx-bestand). Netlify
bouwt dit automatisch tot een echte website + backend.

## Wat is er anders dan de Claude-artifact-versie?

- **Opslag**: `window.storage` is vervangen door twee Netlify Functions
  (`netlify/functions/products.mjs` en `orders.mjs`) die Netlify Blobs gebruiken.
  Producten en bestellingen blijven dus gewoon bewaard, nu op je eigen site.
- **Adminbeveiliging is nu écht server-side.** In de artifact-versie was de
  toegangscode een simpele vergelijking in de browser. Hier controleert de
  server elke admin-actie (producten opslaan, bestellingen bekijken/wijzigen)
  tegen een `ADMIN_SECRET` die alleen op de server bekend is.
- **Taalvoorkeur** gebruikt nu `localStorage` in plaats van Claude's opslag.
- **EmailJS blijft ongewijzigd** — dat werkte al los van Claude en werkt hier
  precies hetzelfde.

## Eenmalig instellen

1. **Dependencies installeren**
   ```
   npm install
   ```

2. **EmailJS invullen** — zelfde als voorheen, in `src/App.jsx` bovenaan bij
   `EMAILJS_CONFIG` (serviceId, templateId, publicKey).

3. **Project op GitHub zetten** (nieuwe, lege repository) en pushen.

4. **Site aanmaken op Netlify**
   - "Add new site" -> "Import an existing project" -> kies je GitHub-repo.
   - Build command en publish directory worden automatisch overgenomen uit
     `netlify.toml` — hoef je niets voor te doen.

5. **Admin-toegangscode instellen**
   - Ga naar je site op Netlify -> **Site configuration -> Environment variables**.
   - Voeg toe: `ADMIN_SECRET` = `Til3gn1p01!!` (de code die je al had gekozen — of vul een andere in).
   - Zonder deze stap kan niemand (ook jij niet) inloggen op /admin.

6. **Domein koppelen** (optioneel, voor tcghaven.nl)
   - Site configuration -> Domain management -> voeg `tcghaven.nl` toe en volg
     de DNS-instructies van Netlify.

## Lokaal testen (optioneel, voordat je live gaat)

Vereist de Netlify CLI (`npm install -g netlify-cli`).

```
netlify dev
```

Dit start zowel de frontend als de functions lokaal, inclusief een lokale
(sandboxed) Blobs-opslag — je test dus niet met live data.

## Structuur

```
├── src/App.jsx              alle UI, taalsysteem, admin — vrijwel 1-op-1 de
│                             app die je al kende, alleen de opslaglaag is
│                             vervangen (zie DATALAAG-sectie bovenin het bestand)
├── netlify/functions/
│   ├── products.mjs          GET (publiek) / PUT (admin) — catalogus
│   └── orders.mjs            GET (admin) / POST (publiek) / PATCH — bestellingen
├── index.html, src/main.jsx  standaard Vite-entrypoints
└── netlify.toml              build- en routeconfiguratie
```

## Let op

Dit project is opgezet en op syntax gecontroleerd, maar nog niet tegen een
live Netlify-omgeving getest (dat kan ik vanaf hier niet). Loop je bij de
eerste deploy tegen een foutmelding aan, stuur die dan door — dan los ik het
direct met je op.
