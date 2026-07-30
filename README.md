# SalchiMrabs — Charcutería de Altura

An immersive, bilingual (ES / EN) commerce experience for a fictional high-altitude charcuterie house in La Paz, Bolivia. Built as a production-shaped Next.js App Router project: scroll-driven storytelling, WebGL, a working cart / checkout / reservation flow, and an architecture designed to grow.

```
npm install
npm run dev     # http://localhost:3000 -> redirects to /es
npm run build   # production build (what Vercel runs)
```

Deploy: import the repo on Vercel, framework preset **Next.js**, no env vars required. `NEXT_PUBLIC_SITE_URL` is optional (metadata + sitemap).

---

## Design philosophy: "Temperatura"

The whole palette is a thermal narrative. Sausage-making moves from cold to fire, so the page does too. Every section declares a `data-temp` value and the theme tokens (`--bg`, `--ink`, `--accent`, `--line`, `--surface`) cross-fade as you scroll:

| `data-temp` | Moment | Feel |
| --- | --- | --- |
| `cold` | curing chamber, 4 °C | mineral pale green, quiet |
| `cure` | resting on paper | warm bone, editorial |
| `smoke` | eucalyptus smokehouse | deep charcoal, ember accent |
| `fire` | the grill | drenched embers |

Colour is authored in **OKLCH**, neutrals are tinted toward the brand hue, and a cursor-tracked light (`--mx` / `--my`) lifts surfaces reactively. Type is a three-role system: `Instrument Serif` for editorial display, `Archivo` for interface, `DM Mono` for technical micro-labels (weights, temperatures, indices).

No stock photography, no external image hosts: **all product and recipe visuals are procedural SVG** (`components/ui/SausageArt.tsx`) plus WebGL, so nothing can 404 after deploy and the whole thing stays light on mobile.

## Motion stack (three libraries, three jobs)

- **Lenis** — smooth scroll, driven by the GSAP ticker so scroll position and animation share one clock.
- **GSAP + ScrollTrigger** — timeline work tied to scroll: pinned manifesto, horizontal catalogue rail, sticky process, split-text reveals, thermal theme switching.
- **Framer Motion** — component state: menus, drawers, page enters, 3D tilt springs, list staggers.
- **Three.js** (vanilla, no react-three wrapper) — a custom FBM smoke shader in the hero and a procedurally textured sausage mesh on product pages. Both respect device tier and `prefers-reduced-motion`.

## Two builds, one codebase

`useDeviceTier()` resolves a tier (`lite` | `full`) from viewport, pointer type, memory and reduced-motion preference. The desktop build gets the fullscreen overlay nav, WebGL, drag rails and cursor work; the mobile build gets a bottom sheet nav, a persistent action bar, snap carousels, lighter DPR and CSS-only ambience. Not a shrunken desktop: a different layout with the same content.

## Architecture

```
app/
  layout.tsx              root shell: fonts, smooth scroll, grain, cursor
  [locale]/               localized routes (es | en)
    layout.tsx            dictionary provider, header, footer, cart, preloader
    page.tsx              home: 12 scroll-driven sections
    catalogo/             catalogue index + [slug] product detail
    recetas/              recipe index + [slug] detail
    clientes/             wholesale / partners
    reserva/              table + catering reservation
    checkout/             cart -> shipping -> payment -> confirmation
    cuenta/               sign in / sign up / session
    nosotros/             brand story
  api/                    checkout + newsletter route handlers
components/
  brand/ layout/ providers/ sections/ ui/ three/ catalog/ product/ forms/
lib/
  i18n/                   locales, dictionaries (es, en), server helper
  data/                   products, recipes, partners, faq (typed, bilingual)
  motion/ hooks/ utils/
styles/                   tokens, base, chrome, home, pages
```

Data lives behind typed accessors in `lib/data`, so swapping the local catalogue for a CMS or database means rewriting one module, not the UI. Cart, auth and orders are client-side (localStorage) with a real route handler validating checkout payloads: replace the mock in `app/api/checkout/route.ts` with a processor and the flow keeps working.

## Roadmap hooks left in place

Product variants and stock counters, order history per account, `lib/data` -> CMS adapter, real payment intents, a third locale (add to `lib/i18n/config.ts` + one dictionary file), and per-product 3D materials.
