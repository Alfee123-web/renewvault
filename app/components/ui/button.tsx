import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  children: ReactNode;
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-[14px] px-4 py-3 text-sm font-medium outline-none transition-all duration-200 ease-out select-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-50";

  const interactive =
    "cursor-pointer hover:-translate-y-0.5 active:translate-y-0.5 active:scale-[0.98]";

  const variants = {
    primary:
      "bg-[var(--accent)] text-white shadow-md shadow-black/20 hover:bg-[var(--accent-hover)] hover:shadow-lg hover:shadow-black/30 active:bg-[var(--accent-hover)]",
    secondary:
      "border border-[var(--border)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--surface-2)] hover:border-[var(--border-strong)] active:bg-[var(--surface-3)]",
  };

  return (
    <button
      className={`${base} ${interactive} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}