import type { ReactNode } from "react";

interface Feature {
  title: string;
  description: string;
  icon: ReactNode;
}

const svgProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const FEATURES: Feature[] = [
  {
    title: "Scan a receipt, skip the typing",
    description:
      "Drop in a screenshot and RenewVault fills in the service, amount, currency and date. Scanning happens right on your device.",
    icon: (
      <svg {...svgProps}>
        <path d="M3 7V5a2 2 0 0 1 2-2h2" />
        <path d="M17 3h2a2 2 0 0 1 2 2v2" />
        <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
        <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
        <path d="M7 12h10" />
      </svg>
    ),
  },
  {
    title: "Split costs with friends",
    description:
      "Sharing a plan with up to 10 people? See your exact share on every card, no calculator needed.",
    icon: (
      <svg {...svgProps}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "40+ popular services",
    description:
      "From Netflix to Notion, pick a service and its logo and category fill in automatically. Search finds it in seconds.",
    icon: (
      <svg {...svgProps}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    title: "Multi-currency, built in",
    description:
      "Track subscriptions in dozens of currencies, with exchange rates and a quick converter one tap away.",
    icon: (
      <svg {...svgProps}>
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    title: "Smart alerts",
    description:
      "Get reminded 1, 7 or 30 days before every renewal, by email and push notifications.",
    icon: (
      <svg {...svgProps}>
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
    ),
  },
  {
    title: "Calendar view",
    description:
      "See every upcoming charge laid out on a calendar, so busy weeks never catch you off guard.",
    icon: (
      <svg {...svgProps}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
];

export default function RecentFeatures() {
  return (
    <section
      id="whats-new"
      className="relative z-10 mx-auto w-full max-w-7xl scroll-mt-20 px-6 py-20 lg:px-8"
    >
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[#8b8df1]">
          Recently added
        </span>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
          Built for how subscriptions actually work
        </h2>
        <p className="mt-4 text-base leading-relaxed text-[var(--text-body)]">
          Less typing, fewer surprises, and a clear view of what you owe and when.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/50 hover:shadow-xl hover:shadow-black/30"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--accent)]/20 bg-[var(--accent)]/10 text-[#8b8df1] transition-colors group-hover:bg-[var(--accent)]/20">
              {feature.icon}
            </div>
            <h3 className="mt-5 text-base font-semibold text-[var(--text-primary)]">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-body)]">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}