// Passthrough root layout. The real <html>/<body> lives in [locale]/layout.tsx so
// `lang` and `dir` can be driven by the active locale. Next.js 15 still requires
// a layout file at the app/ root, and not-found.tsx renders its own <html>/<body>
// for paths that fall outside any locale segment.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
