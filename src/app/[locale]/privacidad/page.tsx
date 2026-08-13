import { setRequestLocale, getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return { title: t("privacyTitle"), description: t("privacySubtitle") };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal" });
  const es = locale === "es";

  const sections = es
    ? [
        {
          h: "1. Responsable del tratamiento",
          p: "GoodLuck es responsable del tratamiento de los datos personales recolectados a través de este sitio, de conformidad con la Ley 1581 de 2012, el Decreto 1377 de 2013 y normas concordantes en Colombia.",
        },
        {
          h: "2. Datos que recolectamos",
          p: "Podemos recolectar nombre, correo, teléfono, dirección de envío, datos de pedido, preferencias de idioma/moneda, contenido de diseños subidos y datos técnicos de navegación (IP, dispositivo, cookies).",
        },
        {
          h: "3. Finalidades",
          p: "Procesar compras y envíos; soporte al cliente; prevención de fraude; mejora del sitio; y, solo con autorización, envío de novedades comerciales.",
        },
        {
          h: "4. Cookies",
          p: "Usamos cookies necesarias para el funcionamiento (sesión, carrito, preferencias) y, si aceptas en el banner, cookies de medición/analítica. Puedes gestionar tu decisión en el navegador y volver a visitar la política. El rechazo de cookies no esenciales no impide comprar.",
        },
        {
          h: "5. Encargados y transferencias",
          p: "Podemos compartir datos con pasarelas de pago, operadores logísticos y proveedores de infraestructura (p. ej. hosting) bajo acuerdos de confidencialidad y solo para las finalidades descritas.",
        },
        {
          h: "6. Derechos de los titulares (Habeas Data)",
          p: "Puedes conocer, actualizar, rectificar y solicitar la supresión de tus datos, así como revocar la autorización, escribiendo a los canales de contacto del sitio. También puedes presentar quejas ante la Superintendencia de Industria y Comercio.",
        },
        {
          h: "7. Seguridad y conservación",
          p: "Aplicamos medidas razonables de seguridad. Conservamos los datos el tiempo necesario para las finalidades y obligaciones legales (facturación, garantías, reclamos).",
        },
        {
          h: "8. Menores de edad",
          p: "El sitio no está dirigido a menores de 18 años. Si detectamos datos de un menor sin autorización, procederemos a su eliminación.",
        },
      ]
    : [
        {
          h: "1. Data controller",
          p: "GoodLuck is the controller of personal data collected through this site, under Colombia's Law 1581 of 2012, Decree 1377 of 2013, and related rules.",
        },
        {
          h: "2. Data we collect",
          p: "We may collect name, email, phone, shipping address, order data, language/currency preferences, uploaded design content, and technical browsing data (IP, device, cookies).",
        },
        {
          h: "3. Purposes",
          p: "Process purchases and shipping; customer support; fraud prevention; site improvement; and, only with authorization, commercial updates.",
        },
        {
          h: "4. Cookies",
          p: "We use necessary cookies for operation (session, cart, preferences) and, if you accept in the banner, analytics cookies. You can manage choices in your browser. Rejecting non-essential cookies does not block checkout.",
        },
        {
          h: "5. Processors & transfers",
          p: "We may share data with payment gateways, logistics operators, and infrastructure providers (e.g. hosting) under confidentiality agreements and only for stated purposes.",
        },
        {
          h: "6. Data-subject rights (Habeas Data)",
          p: "You may access, update, rectify, and request deletion of your data, and revoke authorization via site contact channels. You may also complain to Colombia's Superintendence of Industry and Commerce (SIC).",
        },
        {
          h: "7. Security & retention",
          p: "We apply reasonable security measures. We retain data as needed for purposes and legal duties (billing, warranties, claims).",
        },
        {
          h: "8. Minors",
          p: "This site is not directed at people under 18. If we detect a minor's data without authorization, we will delete it.",
        },
      ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {t("privacyTitle")}
      </h1>
      <p className="mt-3 text-sm text-muted">{t("privacySubtitle")}</p>
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
