import { join } from "path";

export const ROOT = process.cwd();
export const PUBLIC = join(ROOT, "public");

export function publicFile(url: string) {
  return join(PUBLIC, url.replace(/^\//, ""));
}

export function toFileUrl(absolutePath: string) {
  const normalized = absolutePath.replace(/\\/g, "/");
  if (/^[A-Za-z]:/.test(normalized)) {
    return `file:///${normalized}`;
  }
  return `file://${normalized}`;
}
