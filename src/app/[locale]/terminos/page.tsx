import { setRequestLocale, getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return { title: t("termsTitle"), description: t("termsSubtitle") };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal" });
  const es = locale === "es";

  const sections = es
    ? [
        {
          h: "1. Identificación del comerciante",
          p: "GoodLuck opera esta tienda en línea para la comercialización de prendas de vestir y personalización en Colombia. Los datos de contacto comercial y de soporte se informan en el sitio y canales oficiales (incluida WhatsApp cuando esté habilitada).",
        },
        {
          h: "2. Objeto",
          p: "Estos términos regulan el acceso al sitio, el catálogo, el diseñador, el quiz de vibe y la compraventa de productos a través del e-commerce GoodLuck.",
        },
        {
          h: "3. Capacidad y cuenta",
          p: "Al comprar declaras tener capacidad legal para contratar. Puedes comprar como invitado o con cuenta según las opciones disponibles.",
        },
        {
          h: "4. Productos, precios e impuestos",
          p: "Los precios se muestran en COP (y conversión a USD solo informativa en interfaz). Pueden incluir o discriminar impuestos según configuración de checkout. Las imágenes son referenciales; el color real puede variar levemente por pantalla y lote.",
        },
        {
          h: "5. Personalización",
          p: "Los diseños creados por el usuario (texto, imágenes subidas, estampados combinados) pueden generar productos personalizados. El usuario garantiza contar con derechos sobre el contenido que sube y no infringir terceros.",
        },
        {
          h: "6. Pedidos y pago",
          p: "El pedido se confirma tras validación de pago por la pasarela correspondiente o según modalidad contra entrega si aplica. GoodLuck puede rechazar pedidos por fraude, falta de stock o incumplimiento de estos términos.",
        },
        {
          h: "7. Envíos",
          p: "Los envíos se realizan en territorio colombiano según cobertura logística. Los plazos son estimados y pueden variar por ciudad, eventos o fuerza mayor.",
        },
        {
          h: "8. Derecho de retracto y garantías",
          p: "De conformidad con la Ley 1480 de 2011 (Estatuto del Consumidor), en ventas a distancia el consumidor podrá retractarse dentro de los cinco (5) días hábiles siguientes a la entrega, salvo excepciones legales —en particular bienes elaborados conforme a especificaciones del consumidor o claramente personalizados—. Las garantías legales por calidad e idoneidad se atienden según la misma norma.",
        },
        {
          h: "9. Propiedad intelectual",
          p: "Marcas, diseños GoodLuck, catálogo y software del sitio son de GoodLuck o de sus licenciantes. Queda prohibida su reproducción no autorizada.",
        },
        {
          h: "10. Ley aplicable",
          p: "Estos términos se rigen por las leyes de la República de Colombia. Cualquier controversia se tramitará ante las autoridades competentes colombianas, sin perjuicio de mecanismos de protección al consumidor.",
        },
      ]
    : [
        {
          h: "1. Merchant identity",
          p: "GoodLuck operates this online store selling apparel and customization in Colombia. Business and support contacts are listed on the site and official channels (including WhatsApp when enabled).",
        },
        {
          h: "2. Scope",
          p: "These terms cover site access, catalog, designer, vibe quiz, and purchases through the GoodLuck e-commerce experience.",
        },
        {
          h: "3. Capacity & account",
          p: "By purchasing you confirm legal capacity to contract. Guest or account checkout may be available.",
        },
        {
          h: "4. Products, prices & taxes",
          p: "Prices are shown in COP (USD in UI is informational conversion). Taxes follow checkout configuration. Images are referential; color may vary slightly by screen/batch.",
        },
        {
          h: "5. Customization",
          p: "User-created designs (text, uploads, combined prints) may create personalized goods. You warrant rights to uploaded content and non-infringement.",
        },
        {
          h: "6. Orders & payment",
          p: "Orders confirm after payment validation via the relevant gateway or COD when available. GoodLuck may reject orders for fraud, stock, or breach of these terms.",
        },
        {
          h: "7. Shipping",
          p: "Shipments cover Colombian territory per logistics coverage. Lead times are estimates and may vary by city, events, or force majeure.",
        },
        {
          h: "8. Withdrawal & warranties",
          p: "Under Colombia's Consumer Statute (Law 1480 of 2011), distance buyers may withdraw within five (5) business days of delivery, subject to legal exceptions — especially goods made to consumer specifications or clearly personalized. Legal quality warranties apply under the same statute.",
        },
        {
          h: "9. Intellectual property",
          p: "GoodLuck marks, designs, catalog, and site software belong to GoodLuck or licensors. Unauthorized reproduction is prohibited.",
        },
        {
          h: "10. Governing law",
          p: "These terms are governed by the laws of the Republic of Colombia. Disputes go before competent Colombian authorities, without prejudice to consumer-protection mechanisms.",
        },
      ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {t("termsTitle")}
      </h1>
      <p className="mt-3 text-sm text-muted">{t("termsSubtitle")}</p>
      <p className="mt-2 text-xs text-muted">{t("updated")}</p>
      <div className="mt-10 space-y-8">
        {sections.map((s) => (
          <section key={s.h}>
            <h2 className="font-display text-lg font-semibold text-ink">{s.h}</h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground/85">{s.p}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
