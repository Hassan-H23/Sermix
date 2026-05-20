import { Inter, Cairo } from "next/font/google";

// TODO: Replace `inter` with the licensed Neue Haas Grotesk Display once .woff2 files
// are supplied. Load via next/font/local — keep the same CSS variable name so callers
// don't change. Until then, Inter at 700/800 is the display fallback for English.
export const fontLatin = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-latin",
  display: "swap",
});

// Cairo: designed by Mohamed Gaber for Arabic UI. Strong geometric character
// suits Sermix's industrial brand, weights 800/900 read confidently at display
// sizes, and it's familiar to Egyptian readers. Replaces IBM Plex Sans Arabic,
// which has thinner display weights and less natural letter-joining at scale.
export const fontArabic = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-arabic",
  display: "swap",
});
