// lib/categories.ts
// One place that decides what "the same category" means.

/** Lowercase, trimmed, single-spaced key used ONLY for comparing categories. */
export function categoryKey(raw: string | null | undefined): string {
  return (raw ?? "").trim().replace(/\s+/g, " ").toLowerCase();
}

/** True when two category strings mean the same thing (case/space insensitive). */
export function isSameCategory(a: string | null | undefined, b: string | null | undefined): boolean {
  const keyA = categoryKey(a);
  return keyA !== "" && keyA === categoryKey(b);
}

/**
 * Nice display label for a NEW category.
 * "  education " -> "Education", "ai tools" -> "Ai Tools", "AI & tools" -> "AI & Tools"
 * Short ALL-CAPS words (AI, VPN, SaaS-style acronyms up to 4 letters) are preserved.
 */
export function normalizeCategory(raw: string | null | undefined): string {
  const cleaned = (raw ?? "").trim().replace(/\s+/g, " ");
  if (!cleaned) return "";
  return cleaned
    .split(" ")
    .map((word) => {
      const isShortAcronym = word.length <= 4 && word === word.toUpperCase() && /[A-Z]/.test(word);
      if (isShortAcronym) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

/**
 * Builds a de-duplicated, sorted list of category labels.
 * The FIRST spelling seen wins, so pass your predefined categories first.
 */
export function getUniqueCategories(sources: Array<string | null | undefined>): string[] {
  const seen = new Map<string, string>();
  for (const raw of sources) {
    const key = categoryKey(raw);
    if (!key || seen.has(key)) continue;
    seen.set(key, normalizeCategory(raw));
  }
  return Array.from(seen.values()).sort((a, b) => a.localeCompare(b));
}

/** Returns the existing category label matching `raw`, or null if it is genuinely new. */
export function findExistingCategory(raw: string | null | undefined, known: string[]): string | null {
  const key = categoryKey(raw);
  if (!key) return null;
  return known.find((k) => categoryKey(k) === key) ?? null;
}