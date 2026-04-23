import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-off-white px-6 py-24">
      <section className="w-full max-w-xl rounded-2xl border border-dark-slate/10 bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-industrial-orange">404</p>
        <h1 className="mt-3 text-3xl font-bold text-dark-slate">Page Not Found</h1>
        <p className="mt-4 text-steel-gray">
          The page you requested is unavailable. Return to the homepage to continue browsing projects and services.
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex rounded-lg bg-dark-slate px-5 py-3 text-sm font-semibold text-off-white transition hover:bg-dark-slate/90"
        >
          Back to Home
        </Link>
      </section>
    </main>
  );
}
