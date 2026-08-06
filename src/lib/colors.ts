export const COLOR_HEX: Record<string, string> = {
  negro: "#1a1a1a",
  "off-white": "#f5f2eb",
  "beige-oscuro": "#8b7355",
  "verde-caqui": "#6b705c",
  "verde-oliva": "#556b2f",
  rosado: "#e8a0b0",
  "rosado-apagado": "#b07a85",
  "azul-navy": "#1b2a4a",
  "azul-rey": "#1e3a8a",
  amarilla: "#e8c547",
  roja: "#c0392b",
  "baby-blue": "#a8c5d4",
  gris: "#6b6b6b",
  "gris-medio": "#8a8a8a",
  cafe: "#5c4033",
  "acid-negro": "#2d2d2d",
};

export function colorHex(name: string): string {
  const key = name.toLowerCase().replace(/\s+/g, "-");
  return COLOR_HEX[key] ?? "#888888";
}
