import { Inter, IBM_Plex_Sans_Arabic } from "next/font/google";

// TODO: Replace `inter` with the licensed Neue Haas Grotesk Display once .woff2 files
// are supplied. Load via next/font/local — keep the same CSS variable name so callers
// don't change. Until then, Inter at 700/800 is the display fallback for English.
export const fontLatin = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-latin",
  display: "swap",
});

export const fontArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});
