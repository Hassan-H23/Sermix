import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en">
      <body className="bg-bg text-fg flex min-h-screen items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-display-lg font-extrabold tracking-tight">404</h1>
          <p className="mt-4 text-fg-muted">This page could not be found.</p>
          <Link
            href="/en"
            className="mt-8 inline-flex h-11 items-center justify-center bg-accent px-6 text-sm font-medium text-bg hover:bg-accent-hover transition-colors"
          >
            Go home
          </Link>
        </div>
      </body>
    </html>
  );
}
