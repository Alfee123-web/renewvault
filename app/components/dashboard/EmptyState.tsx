interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md border-dashed py-16 px-6 text-center animate-fade-in-up delay-100">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 text-zinc-500">
        {icon}
      </div>
      <p className="text-zinc-300 font-medium text-sm">{title}</p>
      <p className="text-zinc-500 text-xs mt-1 max-w-xs mx-auto">{description}</p>
    </div>
  );
}