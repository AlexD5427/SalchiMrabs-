import type { Recipe } from '@/lib/types';

export const recipes: Recipe[] = [
  {
    slug: 'choripan-de-la-casa',
    title: { es: 'Choripán de la casa', en: 'House choripán' },
    kicker: { es: 'Parrilla · 25 minutos', en: 'Grill · 25 minutes' },
    intro: {
      es: 'El plato con el que abrimos el taller cada sábado. Chimichurri de menta, pan prensado en la plancha y nada más que estorbe.',
      en: 'The dish we open the workshop with every Saturday. Mint chimichurri, bread pressed on the griddle, and nothing else in the way.',
    },
    minutes: 25,
    servings: 4,
    level: { es: 'Fácil', en: 'Easy' },
    ingredients: [
      { es: '4 piezas de Chorizo Brasa Negra', en: '4 Black Ember Chorizo pieces' },
      { es: '4 panes de yuca abiertos', en: '4 cassava rolls, split' },
      { es: '1 taza de menta y perejil picados', en: '1 cup chopped mint and parsley' },
      { es: '2 dientes de ajo, aceite y vinagre de caña', en: '2 garlic cloves, oil and cane vinegar' },
      { es: 'Sal de Uyuni en escamas', en: 'Uyuni salt flakes' },
    ],
    steps: [
      { es: 'Mezcla hierbas, ajo, aceite y vinagre. Deja reposar veinte minutos.', en: 'Mix herbs, garlic, oil and vinegar. Rest for twenty minutes.' },
      { es: 'Asa el chorizo entero a fuego medio, girando cada tres minutos.', en: 'Grill the chorizo whole over medium heat, turning every three minutes.' },
      { es: 'Abre a lo largo solo al final, para que no pierda jugo.', en: 'Butterfly it only at the end so it keeps its juice.' },
      { es: 'Tuesta el pan en la grasa que quedó y arma con chimichurri generoso.', en: 'Toast the bread in the rendered fat and build with generous chimichurri.' },
    ],
    productSlug: 'brasa-negra',
    hue: 34,
  },
  {
    slug: 'currywurst-altiplano',
    title: { es: 'Currywurst del altiplano', en: 'Highland currywurst' },
    kicker: { es: 'Sartén · 30 minutos', en: 'Pan · 30 minutes' },
    intro: {
      es: 'Berlín pasado por el mercado Rodríguez: salsa de tomate asado, curry y un golpe de locoto seco.',
      en: 'Berlin filtered through Rodríguez market: roasted tomato sauce, curry and a hit of dried locoto.',
    },
    minutes: 30,
    servings: 3,
    level: { es: 'Fácil', en: 'Easy' },
    ingredients: [
      { es: '5 Frankfurter Cristal', en: '5 Crystal Frankfurters' },
      { es: '500 g de tomate asado', en: '500 g roasted tomato' },
      { es: '1 cda de curry en polvo', en: '1 tbsp curry powder' },
      { es: '1 cdta de locoto seco molido', en: '1 tsp ground dried locoto' },
      { es: 'Papas fritas gruesas', en: 'Thick-cut fries' },
    ],
    steps: [
      { es: 'Licua el tomate asado con curry y locoto. Reduce diez minutos.', en: 'Blend roasted tomato with curry and locoto. Reduce for ten minutes.' },
      { es: 'Dora las salchichas en sartén seca hasta que la piel chasquee.', en: 'Brown the sausages in a dry pan until the casing snaps.' },
      { es: 'Corta en rodajas de dos centímetros y baña con la salsa caliente.', en: 'Slice into two-centimetre coins and coat with the hot sauce.' },
      { es: 'Termina con más curry en polvo sobre la salsa, nunca mezclado.', en: 'Finish with more curry powder over the sauce, never stirred in.' },
    ],
    productSlug: 'frankfurter-cristal',
    hue: 84,
  },
  {
    slug: 'salchipapa-de-autor',
    title: { es: 'Salchipapa de autor', en: 'Signature salchipapa' },
    kicker: { es: 'Horno · 45 minutos', en: 'Oven · 45 minutes' },
    intro: {
      es: 'La receta de esquina, tratada en serio: papa nativa dos veces frita, huacatay y mayonesa de ceniza.',
      en: 'The street-corner classic, taken seriously: twice-fried native potato, huacatay and ash mayonnaise.',
    },
    minutes: 45,
    servings: 4,
    level: { es: 'Medio', en: 'Medium' },
    ingredients: [
      { es: '5 Salchichas Huacatay', en: '5 Huacatay Sausages' },
      { es: '1 kg de papa nativa', en: '1 kg native potato' },
      { es: 'Mayonesa con ceniza de cebolla', en: 'Onion-ash mayonnaise' },
      { es: 'Cebolla morada en vinagre', en: 'Pickled red onion' },
      { es: 'Aceite de girasol', en: 'Sunflower oil' },
    ],
    steps: [
      { es: 'Cuece la papa con piel, enfría y aplasta sin deshacer.', en: 'Boil the potato in its skin, cool and press without breaking it.' },
      { es: 'Fríe a 160 °C, reposa, y vuelve a freír a 190 °C.', en: 'Fry at 160 °C, rest, then fry again at 190 °C.' },
      { es: 'Asa las salchichas y córtalas en diagonal ancha.', en: 'Grill the sausages and cut them on a wide bias.' },
      { es: 'Monta en capas y termina con mayonesa de ceniza y encurtido.', en: 'Layer it up and finish with ash mayo and pickles.' },
    ],
    productSlug: 'huacatay',
    hue: 132,
  },
  {
    slug: 'tabla-para-seis',
    title: { es: 'Tabla de charcutería para seis', en: 'Charcuterie board for six' },
    kicker: { es: 'Sin fuego · 20 minutos', en: 'No heat · 20 minutes' },
    intro: {
      es: 'Cómo ordenamos una tabla en el taller: de menos a más humo, siempre en sentido del reloj.',
      en: 'How we lay out a board in the workshop: least to most smoke, always clockwise.',
    },
    minutes: 20,
    servings: 6,
    level: { es: 'Fácil', en: 'Easy' },
    ingredients: [
      { es: '1 Chistorra 45 días en láminas', en: '1 Chistorra 45 days, sliced' },
      { es: '1 Morcilla Trufada tibia', en: '1 warm Truffled Morcilla' },
      { es: 'Queso de altura y manchego', en: 'Highland cheese and manchego' },
      { es: 'Membrillo y nueces tostadas', en: 'Quince paste and toasted walnuts' },
      { es: 'Pan de masa madre', en: 'Sourdough bread' },
    ],
    steps: [
      { es: 'Saca los curados treinta minutos antes: el frío esconde el sabor.', en: 'Take cured cuts out thirty minutes early: cold hides flavour.' },
      { es: 'Lamina la chistorra casi transparente, con cuchillo largo.', en: 'Slice the chistorra near-transparent with a long knife.' },
      { es: 'Coloca de suave a intenso siguiendo el reloj.', en: 'Place mild to intense, going clockwise.' },
      { es: 'Deja el pan aparte, tibio, para que no absorba aromas.', en: 'Keep the bread apart and warm so it does not absorb aromas.' },
    ],
    productSlug: 'chistorra-45',
    hue: 42,
  },
  {
    slug: 'wurst-cerveza-negra',
    title: { es: 'Wurst al vapor de cerveza negra', en: 'Stout-steamed wurst' },
    kicker: { es: 'Olla · 35 minutos', en: 'Pot · 35 minutes' },
    intro: {
      es: 'Vapor de cerveza negra, cebolla y laurel. Nada de hervir: la piel se rompe y se pierde la fiesta.',
      en: 'Steam of stout, onion and bay. Never boil: the casing splits and the party is over.',
    },
    minutes: 35,
    servings: 4,
    level: { es: 'Medio', en: 'Medium' },
    ingredients: [
      { es: '5 Bratwurst Alpina', en: '5 Alpine Bratwurst' },
      { es: '500 ml de cerveza negra', en: '500 ml stout' },
      { es: '2 cebollas en juliana', en: '2 onions, julienned' },
      { es: '2 hojas de laurel', en: '2 bay leaves' },
      { es: 'Mostaza antigua', en: 'Wholegrain mustard' },
    ],
    steps: [
      { es: 'Sofríe la cebolla hasta dorar bien, sin apuro.', en: 'Sweat the onion until deeply golden, unhurried.' },
      { es: 'Añade cerveza y laurel, lleva a temblor, nunca a hervor.', en: 'Add stout and bay, bring to a tremble, never a boil.' },
      { es: 'Cocina las salchichas doce minutos en ese vapor.', en: 'Cook the sausages twelve minutes in that steam.' },
      { es: 'Termina en plancha caliente treinta segundos por lado.', en: 'Finish on a hot griddle, thirty seconds per side.' },
    ],
    productSlug: 'bratwurst-alpina',
    hue: 72,
  },
];

export function getRecipe(slug: string) {
  return recipes.find((r) => r.slug === slug);
}

export function recipesForProduct(slug: string) {
  return recipes.filter((r) => r.productSlug === slug);
}
