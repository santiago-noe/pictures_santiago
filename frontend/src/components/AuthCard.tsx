export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500 text-lg font-semibold text-white">
            M
          </div>
          <h1 className="text-xl font-semibold text-ink-900">{title}</h1>
          <p className="mt-1 text-sm text-ink-500">{subtitle}</p>
        </div>
        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
          {children}
        </div>
      </div>
    </div>
  );
}
