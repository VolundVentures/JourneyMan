export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 mesh-bg" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-brand-500/5 blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent-500/5 blur-[128px]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        {children}
      </div>
    </div>
  );
}
