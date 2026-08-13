import QRCode from "qrcode";

/** Normalize user input into a scannable URL string. */
export function normalizeQrPayload(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;

  // Allow plain domains and full URLs
  if (/^https?:\/\//i.test(raw)) return raw;
  if (/^[\w.-]+\.[a-z]{2,}([/:?#].*)?$/i.test(raw)) {
    return `https://${raw}`;
  }
  // Still encode other text (Instagram handle, WhatsApp, etc.) as literal payload
  if (raw.length >= 2) return raw;
  return null;
}

export async function qrDataUrlFromLink(input: string): Promise<string> {
  const payload = normalizeQrPayload(input);
  if (!payload) {
    throw new Error("INVALID_LINK");
  }

  return QRCode.toDataURL(payload, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 512,
    color: {
      dark: "#12100e",
      light: "#ffffff",
    },
  });
}
