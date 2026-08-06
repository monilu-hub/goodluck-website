import printsJson from "./prints.json";

export type PrintDesign = {
  id: string;
  collection: string;
  name: string;
  url: string;
};

export const PRINTS: PrintDesign[] = printsJson as PrintDesign[];

export function getPrintsByCollection(collection?: string) {
  if (!collection) return PRINTS;
  return PRINTS.filter((p) => p.collection === collection);
}

export const PRINT_COLLECTIONS = [
  { id: "rompehielos", label: "Rompehielos" },
  { id: "gen-z", label: "Gen Z" },
  { id: "trending", label: "Trending" },
  { id: "dia-padre", label: "Día del Padre" },
  { id: "mundial", label: "Mundial" },
] as const;
