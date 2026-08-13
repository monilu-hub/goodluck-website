export type BlogPost = {
  slug: string;
  title: { es: string; en: string };
  excerpt: { es: string; en: string };
  body: { es: string[]; en: string[] };
  coverImage: string;
  tags: string[];
  minutes: number;
  publishedAt: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "senales-de-estilo-2026",
    title: {
      es: "Señales de estilo 2026: menos logo, más intención",
      en: "Style signals 2026: less logo, more intention",
    },
    excerpt: {
      es: "La tendencia no es gritar marca: es elegir una frase que diga quién eres sin explicarte.",
      en: "The trend isn't shouting a brand — it's picking a line that says who you are without explaining.",
    },
    body: {
      es: [
        "En 2026 el streetwear premium se mueve hacia señales quietas: tipografías personales, bordados cortos y siluetas oversized que dejan espacio al mensaje.",
        "GoodLuck nace ahí: no como un slogan vacío, sino como una invitación. La ropa funciona como señal social — lo que llevas en el pecho es una hipótesis sobre cómo quieres ser leído.",
        "Si tu frase es lenta, íntima o juguetona, el corte y el color deberían sostenerla. Por eso el diseñador y el mapa de vibe existen juntos.",
      ],
      en: [
        "In 2026 premium streetwear leans into quiet signals: personal type, short embroidery, oversized silhouettes that leave room for the message.",
        "GoodLuck lives there: not as an empty slogan, but as an invitation. Clothes are social signals — what sits on your chest is a hypothesis about how you want to be read.",
        "If your line is slow, intimate, or playful, cut and color should hold it. That's why the designer and vibe map belong together.",
      ],
    },
    coverImage: "/products/mockups/camiseta-oversized-fit-negro-h-m-co-1-front.webp",
    tags: ["tendencias", "SS26"],
    minutes: 4,
    publishedAt: "2026-08-01",
  },
  {
    slug: "oversized-y-atraccion",
    title: {
      es: "Por qué el oversized también es lenguaje corporal",
      en: "Why oversized is body language too",
    },
    excerpt: {
      es: "Un fit holgado no es pereza: es espacio. Y el espacio comunica seguridad.",
      en: "A loose fit isn't laziness — it's space. And space reads as ease.",
    },
    body: {
      es: [
        "El oversized reduce la tensión visual. En psicología social, esa holgura se lee como baja necesidad de aprobación: no estás pidiendo permiso para ocupar el cuarto.",
        "Combinado con una frase corta en el pecho, el contraste funciona: cuerpo relajado + mensaje preciso.",
        "Tip GoodLuck: elige talla pensando en caída, no en ‘apretado’. Luego personaliza. El mensaje gana cuando la silueta no pelea.",
      ],
      en: [
        "Oversized softens visual tension. In social psychology that ease reads as low approval-seeking: you're not asking permission to take up space.",
        "Paired with a short chest line, the contrast works: relaxed body + precise message.",
        "GoodLuck tip: size for drape, not squeeze. Then customize. The message wins when the silhouette isn't fighting it.",
      ],
    },
    coverImage: "/products/mockups/camiseta-oversized-fit-off-white.webp",
    tags: ["fit", "psicología"],
    minutes: 3,
    publishedAt: "2026-07-18",
  },
  {
    slug: "mundial-street-colombia",
    title: {
      es: "Mundial en la calle: color con criterio colombiano",
      en: "World Cup on the street: Colombian color with taste",
    },
    excerpt: {
      es: "La edición FIFA26 no es disfraz: es energía. Cómo llevarla sin perder estilo.",
      en: "The FIFA26 drop isn't costume — it's energy. How to wear it without losing style.",
    },
    body: {
      es: [
        "Los colores vivos funcionan cuando el resto del outfit se mantiene limpio: denim crudo, sneakers simples, un solo acento.",
        "En Colombia el Mundial se vive en bloque, en terraza y en la noche. La prenda tiene que sobrevivir las tres.",
        "Si personalizas, evita saturar: un gráfico o una frase. Dos mensajes a la vez diluyen la señal.",
      ],
      en: [
        "Bold color works when the rest of the outfit stays clean: raw denim, simple sneakers, one accent.",
        "In Colombia the World Cup lives in watch parties, terraces, and nights out. The piece has to survive all three.",
        "If you customize, don't overcrowd: one graphic or one line. Two messages at once dilute the signal.",
      ],
    },
    coverImage: "/products/designs/mundial-2026/camiseta-roja-front.webp",
    tags: ["mundial", "color"],
    minutes: 3,
    publishedAt: "2026-07-05",
  },
];

export function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
