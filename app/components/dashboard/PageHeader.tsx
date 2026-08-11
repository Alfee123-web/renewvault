interface PageHeaderProps {
  title: string;
  description: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8 pt-14 lg:pt-0 animate-fade-in-up">
      <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
      <p className="hidden sm:block text-sm text-zinc-400 mt-1">{description}</p>
    </div>
  );
}