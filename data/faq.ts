export type FaqItem = {
  q: { es: string; en: string };
  a: { es: string; en: string };
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: {
      es: "¿Hacen envíos a toda Colombia?",
      en: "Do you ship across Colombia?",
    },
    a: {
      es: "Sí. Enviamos a nivel nacional. Los tiempos varían según ciudad; al confirmar el pedido te compartimos guía de seguimiento.",
      en: "Yes. We ship nationwide. Timing varies by city; after checkout we share tracking details.",
    },
  },
  {
    q: {
      es: "¿Puedo cambiar o devolver una prenda?",
      en: "Can I exchange or return an item?",
    },
    a: {
      es: "Aplican las reglas del Estatuto del Consumidor (Ley 1480). Para compras a distancia puedes ejercer retracto dentro de los 5 días hábiles siguientes a la entrega, si la prenda no es personalizada a tu medida/diseño exclusivo. Las personalizadas solo se cambian por defecto de fabricación.",
      en: "Colombia's Consumer Statute (Law 1480) applies. For distance purchases you may withdraw within 5 business days of delivery if the item isn't custom-made for you. Personalized pieces are only exchanged for manufacturing defects.",
    },
  },
  {
    q: {
      es: "¿Las camisetas personalizadas tienen el mismo plazo de retracto?",
      en: "Do customized tees have the same withdrawal window?",
    },
    a: {
      es: "Si el diseño es único a tu pedido (texto/imagen propia), normalmente no aplica retracto por ser un bien personalizado. Si hay error nuestro de impresión o calidad, lo resolvemos.",
      en: "If the design is unique to your order (your text/image), withdrawal usually doesn't apply as a personalized good. If we print or quality-error, we make it right.",
    },
  },
  {
    q: {
      es: "¿Qué métodos de pago aceptan?",
      en: "Which payment methods do you accept?",
    },
    a: {
      es: "Pagos en Colombia vía pasarelas habilitadas (p. ej. Stripe, Wompi, Mercado Pago) y, cuando esté activo, contra entrega en ciudades seleccionadas.",
      en: "Payments in Colombia via enabled gateways (e.g. Stripe, Wompi, Mercado Pago) and, when active, cash on delivery in selected cities.",
    },
  },
  {
    q: {
      es: "¿Cómo tratan mis datos personales?",
      en: "How do you handle my personal data?",
    },
    a: {
      es: "Conforme a la Ley 1581 de 2012 y decretos reglamentarios. Usamos tus datos para procesar pedidos, soporte y, si autorizas, comunicaciones. Detalle en Privacidad y cookies.",
      en: "Under Colombia's Law 1581 of 2012. We use your data to process orders, support, and — if you authorize — communications. Details in Privacy & cookies.",
    },
  },
  {
    q: {
      es: "¿Puedo diseñar mi propia camiseta?",
      en: "Can I design my own tee?",
    },
    a: {
      es: "Sí. En Diseñar puedes subir foto, usar estampados GoodLuck, texto y previsualizar en modelos. También puedes partir del mapa ‘Tu vibe’.",
      en: "Yes. In Design you can upload a photo, use GoodLuck prints, add text, and preview on models. Or start from the ‘Your vibe’ map.",
    },
  },
];
