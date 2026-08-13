import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import en from "../../messages/en.json";
import es from "../../messages/es.json";

const catalogs = {
  en,
  es,
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as "es" | "en")) {
    locale = routing.defaultLocale;
  }

  const resolved = (locale === "en" ? "en" : "es") as keyof typeof catalogs;

  return {
    locale: resolved,
    messages: catalogs[resolved],
  };
});
