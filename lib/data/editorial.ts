import type { Localized } from '@/lib/types';

export interface ProcessStep {
  n: string;
  title: Localized;
  body: Localized;
  hue: number;
}

export const processSteps: ProcessStep[] = [
  {
    n: '01',
    title: { es: 'Selección', en: 'Selection' },
    body: {
      es: 'Compramos animal entero a cuatro criadores de tres valles. Elegimos paleta y panceta el mismo día del despiece.',
      en: 'We buy whole animals from four breeders across three valleys, picking shoulder and belly the same day they are cut.',
    },
    hue: 28,
  },
  {
    n: '02',
    title: { es: 'Molienda', en: 'Grinding' },
    body: {
      es: 'Molemos a menos de cuatro grados, con la máquina fría. Si la grasa se calienta, la textura se rompe y no hay vuelta atrás.',
      en: 'We grind below four degrees with a chilled machine. If the fat warms up the texture breaks, and there is no going back.',
    },
    hue: 200,
  },
  {
    n: '03',
    title: { es: 'Especiado', en: 'Spicing' },
    body: {
      es: 'Todo se muele el mismo día: pimentón, comino, huacatay, canela. Nada de mezclas guardadas de la semana anterior.',
      en: 'Everything is ground the same morning: paprika, cumin, huacatay, cinnamon. No blends left over from last week.',
    },
    hue: 128,
  },
  {
    n: '04',
    title: { es: 'Humo', en: 'Smoke' },
    body: {
      es: 'Roble viejo y duelas de barrica, entre nueve y catorce horas a temperatura baja. El horno se abre una sola vez.',
      en: 'Old oak and barrel staves, nine to fourteen hours at low temperature. The oven is opened exactly once.',
    },
    hue: 38,
  },
  {
    n: '05',
    title: { es: 'Reposo', en: 'Rest' },
    body: {
      es: 'Cámara a doce grados. De dos días a cuarenta y cinco, según la pieza. Aquí es donde casi todos se apuran; nosotros no.',
      en: 'Chamber at twelve degrees. From two days to forty-five, depending on the cut. This is where most people rush. We do not.',
    },
    hue: 340,
  },
];

export interface Milestone {
  year: string;
  title: Localized;
  body: Localized;
}

export const timeline: Milestone[] = [
  {
    year: '2014',
    title: { es: 'Una parrilla prestada', en: 'A borrowed grill' },
    body: {
      es: 'Mariana Rabs vende ochenta choripanes en la feria de Sopocachi. Se acaban en dos horas.',
      en: 'Mariana Rabs sells eighty choripanes at the Sopocachi market. They run out in two hours.',
    },
  },
  {
    year: '2017',
    title: { es: 'El primer horno', en: 'The first oven' },
    body: {
      es: 'Cuatro metros de ladrillo en la calle Comercio. El humo empieza a ser una decisión, no un accidente.',
      en: 'Four metres of brick on Comercio street. Smoke becomes a decision instead of an accident.',
    },
  },
  {
    year: '2021',
    title: { es: 'Cámara de curado', en: 'Curing chamber' },
    body: {
      es: 'Entran los curados largos al catálogo. La chistorra de cuarenta y cinco días nace de un error de cálculo.',
      en: 'Long-cured cuts enter the catalogue. The forty-five day chistorra is born from a miscalculation.',
    },
  },
  {
    year: '2026',
    title: { es: 'Once metros de horno', en: 'Eleven metres of oven' },
    body: {
      es: 'Cuatro puntos de venta, treinta cocinas asociadas y el mismo lote corto de siempre.',
      en: 'Four shops, thirty partner kitchens and the same short batch as always.',
    },
  },
];

export interface Figure {
  value: string;
  label: Localized;
}

export const figures: Figure[] = [
  { value: '100', label: { es: 'piezas por lote', en: 'cuts per batch' } },
  { value: '14', label: { es: 'horas máximas de humo', en: 'max hours of smoke' } },
  { value: '45', label: { es: 'días de curado largo', en: 'days of long cure' } },
  { value: '4', label: { es: 'criadores aliados', en: 'partner breeders' } },
];

export interface Testimonial {
  quote: Localized;
  name: string;
  role: Localized;
  city: string;
  hue: number;
}

export const testimonials: Testimonial[] = [
  {
    quote: {
      es: 'Cambiamos toda la carta de embutidos por su catálogo. La chistorra de cuarenta y cinco días sostiene sola un plato.',
      en: 'We swapped our whole charcuterie list for their catalogue. The forty-five day chistorra carries a dish on its own.',
    },
    name: 'Gustavo Arrieta',
    role: { es: 'Chef, Ancestral', en: 'Chef, Ancestral' },
    city: 'La Paz',
    hue: 34,
  },
  {
    quote: {
      es: 'Nos entregan el lote con ficha firmada y fecha de horno. Para una cocina con auditoría, eso vale oro.',
      en: 'Each batch arrives with a signed sheet and oven date. For an audited kitchen that is worth gold.',
    },
    name: 'Rocío Mendieta',
    role: { es: 'Jefa de compras, Grupo Altiplano', en: 'Head of purchasing, Grupo Altiplano' },
    city: 'El Alto',
    hue: 200,
  },
  {
    quote: {
      es: 'La Huacatay se volvió nuestro plato firma sin querer. Los clientes vienen preguntando por ella por nombre.',
      en: 'The Huacatay accidentally became our signature. Guests come in asking for it by name.',
    },
    name: 'Tania Quispe',
    role: { es: 'Propietaria, Verde Fuego', en: 'Owner, Verde Fuego' },
    city: 'Cochabamba',
    hue: 132,
  },
  {
    quote: {
      es: 'Pedimos treinta kilos cada viernes desde 2022 y nunca llegó un lote distinto al anterior.',
      en: 'Thirty kilos every Friday since 2022, and never once a batch that drifted from the last.',
    },
    name: 'Emilio Saavedra',
    role: { es: 'Parrillero, Fogón 7', en: 'Grill master, Fogón 7' },
    city: 'Santa Cruz',
    hue: 14,
  },
  {
    quote: {
      es: 'La caja del Club nos resolvió el catering de invierno tres años seguidos.',
      en: 'The Club box has solved our winter catering three years running.',
    },
    name: 'Paula Iriarte',
    role: { es: 'Catering Sal & Brasa', en: 'Sal & Brasa catering' },
    city: 'Sucre',
    hue: 92,
  },
];

export const partners: string[] = [
  'Ancestral',
  'Verde Fuego',
  'Fogón 7',
  'Grupo Altiplano',
  'Mercado Central',
  'Café Illimani',
  'Sal & Brasa',
  'Casa Zongo',
  'Bistró Prado',
  'Club Alpino',
];

export interface WholesaleTier {
  name: Localized;
  from: number;
  discount: string;
  perks: Localized[];
}

export const wholesaleTiers: WholesaleTier[] = [
  {
    name: { es: 'Mesa chica', en: 'Small table' },
    from: 20,
    discount: '-12 %',
    perks: [
      { es: 'Entrega semanal fija', en: 'Fixed weekly delivery' },
      { es: 'Ficha técnica por lote', en: 'Spec sheet per batch' },
    ],
  },
  {
    name: { es: 'Cocina activa', en: 'Active kitchen' },
    from: 60,
    discount: '-18 %',
    perks: [
      { es: 'Dos entregas por semana', en: 'Two deliveries a week' },
      { es: 'Capacitación de corte', en: 'Cutting training' },
      { es: 'Crédito a 15 días', en: '15-day credit' },
    ],
  },
  {
    name: { es: 'Grupo', en: 'Group' },
    from: 150,
    discount: '-25 %',
    perks: [
      { es: 'Producción reservada', en: 'Reserved production' },
      { es: 'Receta exclusiva a medida', en: 'Bespoke exclusive recipe' },
      { es: 'Visita al taller con tu equipo', en: 'Workshop visit with your team' },
    ],
  },
];

export interface ClubTier {
  slug: string;
  name: Localized;
  price: number;
  tagline: Localized;
  perks: Localized[];
  hue: number;
  popular?: boolean;
}

export const clubTiers: ClubTier[] = [
  {
    slug: 'brasa',
    name: { es: 'Brasa', en: 'Ember' },
    price: 180,
    tagline: { es: 'Dos piezas al mes y la carta del taller.', en: 'Two cuts a month plus the workshop letter.' },
    perks: [
      { es: '2 piezas rotativas', en: '2 rotating cuts' },
      { es: 'Envío incluido en La Paz', en: 'Free delivery in La Paz' },
      { es: 'Receta impresa del mes', en: 'Printed recipe of the month' },
    ],
    hue: 38,
  },
  {
    slug: 'humo',
    name: { es: 'Humo', en: 'Smoke' },
    price: 320,
    tagline: { es: 'Cuatro piezas, una siempre de edición corta.', en: 'Four cuts, one always short-edition.' },
    perks: [
      { es: '4 piezas, 1 exclusiva del club', en: '4 cuts, 1 club exclusive' },
      { es: 'Envío nacional incluido', en: 'Nationwide delivery included' },
      { es: 'Acceso previo a lotes nuevos', en: 'Early access to new batches' },
      { es: '10 % en todo el catálogo', en: '10 % off the whole catalogue' },
    ],
    hue: 24,
    popular: true,
  },
  {
    slug: 'ceniza',
    name: { es: 'Ceniza', en: 'Ash' },
    price: 560,
    tagline: { es: 'La caja grande, con curados largos y cata anual.', en: 'The big box, long cures and a yearly tasting.' },
    perks: [
      { es: '7 piezas, incluye curados largos', en: '7 cuts, long cures included' },
      { es: 'Cata anual para dos en el taller', en: 'Yearly tasting for two at the workshop' },
      { es: 'Personalización de nivel de picante', en: 'Custom heat level' },
      { es: '15 % en todo el catálogo', en: '15 % off the whole catalogue' },
    ],
    hue: 340,
  },
];

export interface JournalNote {
  slug: string;
  date: string;
  title: Localized;
  excerpt: Localized;
  minutes: number;
  hue: number;
}

export const journal: JournalNote[] = [
  {
    slug: 'lote-214',
    date: '2026-07-12',
    title: { es: 'Lote 214: qué salió mal y por qué lo vendimos igual', en: 'Batch 214: what went wrong and why we sold it anyway' },
    excerpt: {
      es: 'El termómetro del horno dos se atrasó cuarenta minutos. La pieza salió más seca y más interesante.',
      en: 'Oven two ran forty minutes behind. The cut came out drier, and far more interesting.',
    },
    minutes: 4,
    hue: 38,
  },
  {
    slug: 'sal-de-uyuni',
    date: '2026-06-28',
    title: { es: 'Por qué la sal de Uyuni cambia la textura', en: 'Why Uyuni salt changes the texture' },
    excerpt: {
      es: 'Menos sodio por gramo, más minerales. Tuvimos que reescribir todas las recetas al cambiarla.',
      en: 'Less sodium per gram, more minerals. Switching to it forced us to rewrite every recipe.',
    },
    minutes: 6,
    hue: 200,
  },
  {
    slug: 'humo-a-3600',
    date: '2026-05-19',
    title: { es: 'Ahumar a 3.600 metros no es lo mismo', en: 'Smoking at 3,600 metres is a different craft' },
    excerpt: {
      es: 'Menos oxígeno, combustión más lenta, humo más frío. La altura es un ingrediente más.',
      en: 'Less oxygen, slower combustion, colder smoke. Altitude is just another ingredient.',
    },
    minutes: 5,
    hue: 132,
  },
];

export interface Shop {
  name: string;
  address: Localized;
  hours: Localized;
  city: string;
}

export const shops: Shop[] = [
  {
    name: 'Taller Comercio',
    address: { es: 'Calle Comercio 1180, Casco Viejo', en: 'Comercio 1180, Old Town' },
    hours: { es: 'Mar–Dom · 10:00–20:00', en: 'Tue–Sun · 10:00–20:00' },
    city: 'La Paz',
  },
  {
    name: 'Sopocachi',
    address: { es: 'Av. Ecuador 2450, esquina Rosendo Gutiérrez', en: 'Av. Ecuador 2450, corner Rosendo Gutiérrez' },
    hours: { es: 'Lun–Sáb · 09:00–21:00', en: 'Mon–Sat · 09:00–21:00' },
    city: 'La Paz',
  },
  {
    name: 'Mercado 16 de Julio',
    address: { es: 'Sector C, puesto 214', en: 'Sector C, stall 214' },
    hours: { es: 'Jue y Dom · 07:00–15:00', en: 'Thu & Sun · 07:00–15:00' },
    city: 'El Alto',
  },
  {
    name: 'Equipetrol',
    address: { es: 'Calle Los Cusis 45', en: 'Los Cusis 45' },
    hours: { es: 'Lun–Sáb · 10:00–22:00', en: 'Mon–Sat · 10:00–22:00' },
    city: 'Santa Cruz',
  },
];

export interface FaqItem {
  q: Localized;
  a: Localized;
}

export const faq: FaqItem[] = [
  {
    q: { es: '¿Cuánto tarda el envío?', en: 'How long does shipping take?' },
    a: {
      es: 'La Paz y El Alto en 24 horas con motorizado propio. Resto del país en 48 horas en caja térmica con gel. Envío gratis desde Bs 350.',
      en: 'La Paz and El Alto within 24 hours with our own courier. Rest of the country in 48 hours in a gel-packed thermal box. Free shipping over Bs 350.',
    },
  },
  {
    q: { es: '¿Cómo conservo las piezas?', en: 'How do I store the cuts?' },
    a: {
      es: 'Frescas: 4 días en refrigeración o 3 meses congeladas. Ahumadas: 15 días. Curadas: cuélgalas en un lugar fresco y seco, nunca en bolsa cerrada.',
      en: 'Fresh: 4 days refrigerated or 3 months frozen. Smoked: 15 days. Cured: hang them somewhere cool and dry, never in a sealed bag.',
    },
  },
  {
    q: { es: '¿Puedo reservar sin pagar?', en: 'Can I reserve without paying?' },
    a: {
      es: 'Sí. Las reservas apartan tu pieza 48 horas sin cobro. Pagas al retirar en cualquiera de nuestros cuatro puntos.',
      en: 'Yes. A reservation holds your cut for 48 hours at no charge. You pay when collecting at any of our four shops.',
    },
  },
  {
    q: { es: '¿Qué formas de pago aceptan?', en: 'Which payment methods do you take?' },
    a: {
      es: 'Tarjeta de crédito y débito, QR bancario, transferencia y efectivo contra entrega en La Paz y El Alto.',
      en: 'Credit and debit card, bank QR, transfer, and cash on delivery in La Paz and El Alto.',
    },
  },
  {
    q: { es: '¿Trabajan con alérgenos?', en: 'Do you handle allergens?' },
    a: {
      es: 'Cada ficha indica alérgenos. Compartimos línea con mostaza, sulfitos, lactosa y gluten, así que no podemos garantizar cero traza.',
      en: 'Every spec sheet lists allergens. Our line also handles mustard, sulphites, lactose and gluten, so we cannot guarantee zero trace.',
    },
  },
  {
    q: { es: '¿Hay opción vegetal real?', en: 'Is there a real plant-based option?' },
    a: {
      es: 'Umami Vegetal se produce en jornada separada, con utensilios propios, antes de cualquier producción cárnica del día.',
      en: 'Plant Umami is produced on a separate shift with dedicated tools, before any meat production that day.',
    },
  },
];
