export function AuthCard({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-4 py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/4 h-[520px] w-[520px] rounded-full bg-accent-600/20 blur-[140px]" />
        <div className="absolute -bottom-40 right-1/4 h-[520px] w-[520px] rounded-full bg-ink-700/50 blur-[140px]" />
      </div>

      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-6 sm:px-10">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent-500" />
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white">
            Mi Galería
          </span>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent-500">
          {eyebrow}
        </p>
        <h1 className="text-4xl font-black uppercase leading-[1.05] text-white sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-ink-300">{subtitle}</p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
          {children}
        </div>
      </div>
    </div>
  );
}
