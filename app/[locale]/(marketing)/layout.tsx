import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";

// Wraps every page in the (marketing) route group with Header + Footer +
// the channel-branded FABs. Pages keep their own <main> wrapper for now
// (each one decides what id the skip-to-content link targets).

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <FloatingActions />
    </>
  );
}
