# SalchiMrabs

Charcutería ahumada de autor. Tienda inmersiva bilingüe (ES / EN) construida sobre
Next.js App Router, con GSAP + ScrollTrigger, Framer Motion, Three.js y Lenis.

> Wood-smoked craft charcuterie. An immersive bilingual storefront built with the
> Next.js App Router, GSAP + ScrollTrigger, Framer Motion, Three.js and Lenis.

---

## Stack

| Capa | Elección | Por qué |
| --- | --- | --- |
| Framework | Next.js 15, App Router, TypeScript | RSC por defecto, rutas por locale, despliegue directo en Vercel |
| Scroll | Lenis + un único `gsap.ticker` | Un solo reloj para scroll suave y ScrollTrigger: cero desincronización |
| Scroll-animación | GSAP + ScrollTrigger | Pin horizontal, reveals por máscara, cambio de acento por paso |
| Micro-interacción | Framer Motion | Overlays, transiciones de ruta, listas con `layout` |
| 3D | Three.js (WebGL puro, sin postproceso) | Presupuesto controlado por dispositivo |
| Estilos | CSS nativo con tokens en OKLCH | Sin runtime, sin build extra, temas por `data-tone` |
| Estado | React Context (`ui`, `cart`, `auth`) + localStorage | Sin dependencias, persistente, hidratación limpia |

Sin Tailwind, sin librería de componentes, sin CSS-in-JS: todo el sistema visual es
propio y vive en `styles/`.

---

## Arquitectura

```
app/
  [locale]/               # es | en  (este es el root layout: define <html lang>)
    layout.tsx            # fuentes, providers, shell, preloader
    template.tsx          # transición de ruta (solo opacidad, para no romper el pin)
    page.tsx              # portada: 11 secciones
    catalogo/             # índice + [slug] (ficha con turntable 3D)
    recetas/              # índice + [slug]
    clientes/ club/ taller/ reservas/ checkout/ cuenta/ faq/
    not-found.tsx
  robots.ts  sitemap.ts
components/
  art/                    # ProductArt, SceneArt  → imágenes generadas en SVG
  three/                  # EmberScene (hero), Turntable (ficha)
  motion/                 # SmoothScroll, SplitText, Reveal, Parallax, Marquee,
                          # Magnetic, Tilt, Cursor, CountUp, ScrollProgress
  shell/                  # Preloader, Nav, MenuOverlay, CartDrawer, MobileBar,
                          # Footer, Toasts, LocaleSwitch, Providers, GlobalKeys
  sections/               # bloques de portada y páginas interiores
  shop/ checkout/ account/ forms/ ui/
lib/
  i18n/                   # config, diccionarios es/en, helper href()
  data/                   # productos, recetas, contenido editorial (bilingüe)
  store/                  # ui, cart, auth
  hooks/                  # useDeviceTier, useInViewport
  utils/                  # format (money, pick, accentVars), storage
styles/                   # tokens, base, ui, shell, sections, pages, patch
middleware.ts             # detecta idioma y redirige / → /es | /en
```

### Escalable a propósito

- **Contenido separado de la vista.** Añadir una pieza al catálogo es un objeto en
  `lib/data/products.ts`: la ficha, el sitemap, el buscador, el carrito y el arte
  se generan solos.
- **Cada texto es bilingüe en el tipo** (`Localized = { es, en }`), así que el
  compilador avisa si falta una traducción.
- **Un solo diccionario tipado.** `Dictionary` se infiere del español; el inglés
  debe cumplirlo.
- **Tokens antes que clases.** Cualquier sección se pasa a fondo oscuro con
  `data-tone="ink"`; el acento se repinta en runtime con `setAccent(hue)`.

---

## Sistema de diseño

**Color: “Humo & Brasa”.** Tinta carbón (nunca negro puro), papel hueso teñido
hacia el ámbar, brasa racionada, y salmuera / hierba como contrapeso frío. Todo en
OKLCH. El acento es **dinámico**: cada producto, receta y paso del proceso
reescribe `--accent` al entrar en viewport o al hover, así que la interfaz cambia
de temperatura mientras navegas.

**Tipografía.** Tres familias con contraste estructural real:

- `Instrument Serif` — display editorial (y su itálica como acento).
- `Archivo` — interfaz y cuerpo.
- `JetBrains Mono` — metadatos, códigos de lote, cifras tabulares.

**Fotografía dibujada.** No hay stock: `ProductArt` genera cada pieza en SVG
paramétrico (trazo con degradado, veteado determinista, marcas de brasa, halo) y
`SceneArt` construye los escenarios (horno, cámara, mesa, humo). Peso de red: cero,
y todo es animable por CSS.

---

## Rendimiento y accesibilidad

- `useDeviceTier` clasifica el dispositivo (núcleos, memoria, DPR, puntero, motion)
  y de ahí salen: número de mallas, cantidad de chispas, DPR máximo, cursor
  personalizado, magnetismo y parallax.
- Los canvases se pausan fuera de viewport (`IntersectionObserver`) y con la
  pestaña oculta; geometrías, materiales y renderers se liberan al desmontar.
- Sin WebGL disponible: el hero se queda con su escena SVG, que ya está debajo.
- `prefers-reduced-motion` desactiva Lenis, los reveals y el 3D.
- Objetivos táctiles ≥ 44 px, foco visible en ambas superficies, `skip link`,
  Escape cierra menú y carrito, roles y `aria-label` en controles.

### Dos versiones de navegación

| | Escritorio | Móvil |
| --- | --- | --- |
| Navegación | Barra con enlaces + overlay a pantalla completa con preview de producto | Overlay en lista + barra inferior fija de acciones |
| Catálogo | Riel horizontal con pin y scrub | Scroll nativo con snap |
| Cursor | Cursor propio con etiquetas | Nativo |
| Proceso | Escena sticky + pasos | Bloques apilados |

---

## Comercio

Flujo completo en cliente, sin backend: catálogo con filtros / búsqueda / orden /
vista, ficha con turntable arrastrable, carrito persistente con códigos
(`BRASA10`, `HUMO20`, `CLUB15`) y envío gratis desde Bs 350, checkout en tres pasos
con cuatro formas de pago (tarjeta, QR, transferencia, efectivo), reservas sin
pago previo, membresías del club y cuentas con historial.

Modo demostración: no se cobra nada y la sesión vive en `localStorage`. El punto de
entrada para un proveedor real es `CheckoutFlow.pay()`.

---

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000 → redirige a /es o /en
npm run build
npm run typecheck
```

Variables opcionales en `.env.example` (`NEXT_PUBLIC_SITE_URL`).

## Despliegue

Vercel detecta Next.js sin configuración: importar el repositorio y desplegar.
`middleware.ts` se ejecuta en el edge y resuelve el idioma por cookie o
`Accept-Language`.

## Siguientes pasos

1. Sustituir las tiendas locales por API real (mismos tipos en `lib/types.ts`).
2. Pasarela de pago real y webhooks de estado del pedido.
3. CMS para `lib/data/*` (los tipos ya son el contrato).
4. Tercer idioma: añadir el locale en `lib/i18n/config.ts` y su diccionario.
