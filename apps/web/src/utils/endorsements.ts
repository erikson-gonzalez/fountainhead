export interface EndorsementItem {
  name: string;
  url?: string;
}

/** Parse endorsements from DB: JSON array or legacy comma-separated */
export function parseEndorsements(raw: string | undefined): EndorsementItem[] {
  const s = (raw || "").trim();
  if (!s) return [];
  if (s.startsWith("[")) {
    try {
      const parsed = JSON.parse(s) as unknown;
      if (Array.isArray(parsed)) {
        return parsed
          .filter((x): x is EndorsementItem => x && typeof x === "object" && typeof (x as EndorsementItem).name === "string")
          .map((x) => ({ name: (x as EndorsementItem).name, url: (x as EndorsementItem).url || "" }));
      }
    } catch {
      // fall through to legacy
    }
  }
  return s
    .split(/[,;]/)
    .map((x) => x.trim())
    .filter(Boolean)
    .map((name) => ({ name, url: "" }));
}

/** Serialize endorsements to JSON for DB */
export function serializeEndorsements(items: EndorsementItem[]): string {
  return JSON.stringify(items.filter((x) => x?.name?.trim()));
}

export const stringifyEndorsements = serializeEndorsements;
