// lib/services.ts
// One list powers: the service dropdown, its search box, logos (via domain),
// default categories, and receipt (OCR) detection. Add a service here and it works everywhere.

export interface PredefinedService {
  id: string;
  name: string;
  category: string;
  domain: string; // used for the logo (favicon) and for duplicate detection, keep it unique per service
  aliases?: string[]; // extra words that may appear on a receipt (min 4 characters each)
}

export const PREDEFINED_SERVICES: PredefinedService[] = [
  // --- Entertainment ---
  { id: "netflix", name: "Netflix", category: "Entertainment", domain: "netflix.com" },
  { id: "prime", name: "Amazon Prime", category: "Entertainment", domain: "amazon.com", aliases: ["prime video", "amazon prime"] },
  { id: "spotify", name: "Spotify", category: "Entertainment", domain: "spotify.com" },
  { id: "youtube", name: "YouTube Premium", category: "Entertainment", domain: "youtube.com", aliases: ["youtube music", "youtube premium"] },
  { id: "hotstar", name: "JioHotstar", category: "Entertainment", domain: "hotstar.com", aliases: ["hotstar", "disney+ hotstar", "disney hotstar"] },
  { id: "disney", name: "Disney+", category: "Entertainment", domain: "disneyplus.com", aliases: ["disneyplus", "disney plus"] },
  { id: "appletv", name: "Apple TV+", category: "Entertainment", domain: "tv.apple.com", aliases: ["apple tv"] },
  { id: "applemusic", name: "Apple Music", category: "Entertainment", domain: "music.apple.com" },
  { id: "sonyliv", name: "SonyLIV", category: "Entertainment", domain: "sonyliv.com", aliases: ["sony liv"] },
  { id: "zee5", name: "ZEE5", category: "Entertainment", domain: "zee5.com" },
  { id: "hbomax", name: "HBO Max", category: "Entertainment", domain: "max.com", aliases: ["hbo max"] },
  { id: "audible", name: "Audible", category: "Entertainment", domain: "audible.com" },

  // --- AI & Tools ---
  { id: "chatgpt", name: "ChatGPT Plus", category: "AI & Tools", domain: "openai.com", aliases: ["chatgpt", "openai"] },
  { id: "claude", name: "Claude Pro", category: "AI & Tools", domain: "anthropic.com", aliases: ["anthropic"] },
  { id: "gemini", name: "Google AI Pro", category: "AI & Tools", domain: "gemini.google.com", aliases: ["gemini advanced", "google ai"] },
  { id: "perplexity", name: "Perplexity Pro", category: "AI & Tools", domain: "perplexity.ai", aliases: ["perplexity"] },
  { id: "midjourney", name: "Midjourney", category: "AI & Tools", domain: "midjourney.com" },
  { id: "grammarly", name: "Grammarly", category: "AI & Tools", domain: "grammarly.com" },

  // --- Developer Tools ---
  { id: "github", name: "GitHub Copilot", category: "Developer Tools", domain: "github.com", aliases: ["github"] },
  { id: "cursor", name: "Cursor Pro", category: "Developer Tools", domain: "cursor.com", aliases: ["cursor ai"] },
  { id: "vercel", name: "Vercel Pro", category: "Developer Tools", domain: "vercel.com", aliases: ["vercel"] },
  { id: "jetbrains", name: "JetBrains", category: "Developer Tools", domain: "jetbrains.com", aliases: ["intellij", "pycharm", "webstorm"] },

  // --- Design ---
  { id: "adobe", name: "Adobe Creative Cloud", category: "Design", domain: "adobe.com", aliases: ["adobe", "creative cloud"] },
  { id: "canva", name: "Canva Pro", category: "Design", domain: "canva.com", aliases: ["canva"] },
  { id: "figma", name: "Figma", category: "Design", domain: "figma.com" },

  // --- Productivity ---
  { id: "m365", name: "Microsoft 365", category: "Productivity", domain: "microsoft.com", aliases: ["microsoft 365", "office 365"] },
  { id: "notion", name: "Notion", category: "Productivity", domain: "notion.so" },
  { id: "todoist", name: "Todoist", category: "Productivity", domain: "todoist.com" },
  { id: "slack", name: "Slack", category: "Productivity", domain: "slack.com" },
  { id: "zoom", name: "Zoom", category: "Productivity", domain: "zoom.us" },
  { id: "linkedin", name: "LinkedIn Premium", category: "Productivity", domain: "linkedin.com", aliases: ["linkedin"] },

  // --- Cloud Storage ---
  { id: "googleone", name: "Google One", category: "Cloud Storage", domain: "one.google.com", aliases: ["google one"] },
  { id: "icloud", name: "iCloud+", category: "Cloud Storage", domain: "icloud.com", aliases: ["icloud"] },
  { id: "dropbox", name: "Dropbox", category: "Cloud Storage", domain: "dropbox.com" },

  // --- Security ---
  { id: "nordvpn", name: "NordVPN", category: "Security", domain: "nordvpn.com", aliases: ["nord vpn"] },
  { id: "expressvpn", name: "ExpressVPN", category: "Security", domain: "expressvpn.com", aliases: ["express vpn"] },
  { id: "1password", name: "1Password", category: "Security", domain: "1password.com" },

  // --- Education ---
  { id: "coursera", name: "Coursera", category: "Education", domain: "coursera.org" },
  { id: "duolingo", name: "Duolingo", category: "Education", domain: "duolingo.com" },
  { id: "udemy", name: "Udemy", category: "Education", domain: "udemy.com" },
  { id: "skillshare", name: "Skillshare", category: "Education", domain: "skillshare.com" },

  // --- Gaming ---
  { id: "xbox", name: "Xbox Game Pass", category: "Gaming", domain: "xbox.com", aliases: ["game pass", "xbox"] },
  { id: "psplus", name: "PlayStation Plus", category: "Gaming", domain: "playstation.com", aliases: ["playstation", "ps plus"] },
  { id: "nintendo", name: "Nintendo Switch Online", category: "Gaming", domain: "nintendo.com", aliases: ["nintendo"] },

  // --- Food & Lifestyle ---
  { id: "swiggy", name: "Swiggy One", category: "Food & Lifestyle", domain: "swiggy.com", aliases: ["swiggy"] },
  { id: "zomato", name: "Zomato Gold", category: "Food & Lifestyle", domain: "zomato.com", aliases: ["zomato"] },
  { id: "cultfit", name: "Cult.fit", category: "Food & Lifestyle", domain: "cult.fit", aliases: ["cultfit"] },
];

/** The "Other (Custom)" option is handled separately so it can stay pinned at the bottom. */
export const CUSTOM_SERVICE = { id: "custom", name: "Other (Custom)" } as const;

/** Names plus aliases for one service, lowercased, ignoring anything under 4 characters. */
function searchTerms(service: PredefinedService): string[] {
  return [service.name, ...(service.aliases ?? [])]
    .map((t) => t.toLowerCase())
    .filter((t) => t.length >= 4);
}

/**
 * Finds which service a receipt/invoice text mentions.
 * If several match, the one with the longest matching term wins
 * (so "youtube premium" beats a stray short word).
 */
export function detectServiceFromText(text: string): PredefinedService | null {
  const lower = text.toLowerCase();
  let best: PredefinedService | null = null;
  let bestLength = 0;

  for (const service of PREDEFINED_SERVICES) {
    for (const term of searchTerms(service)) {
      if (lower.includes(term) && term.length > bestLength) {
        best = service;
        bestLength = term.length;
      }
    }
  }
  return best;
}

/** Filters services for the dropdown search box (name, category, or alias). */
export function searchServices(query: string): PredefinedService[] {
  const q = query.trim().toLowerCase();
  if (!q) return PREDEFINED_SERVICES;
  return PREDEFINED_SERVICES.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      (s.aliases ?? []).some((a) => a.toLowerCase().includes(q))
  );
}