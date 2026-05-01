import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  DM_Serif_Display,
  DM_Sans,
  Tenor_Sans,
} from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import { Footer } from "@/components/layout/Footer";
import { FloatingCTAs } from "@/components/ui/FloatingCTAs";
// import { Navbar } from "@/components/ui/Navbar";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-dm-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

const tenorSans = Tenor_Sans({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-tenor",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yamuna Sky City | Luxury Sea-Facing Apartments in Mangalore",
  description:
    "296 all sea-facing luxury apartments at Yamuna Sky City, Mangalore. GF+60 floors on NH-66 corridor, 300m from the Arabian Sea. RERA registered.",
  keywords: "Yamuna Sky City, luxury apartments Mangalore, sea view homes, coastal living Karnataka",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSerif.variable} ${dmSans.variable} ${tenorSans.variable}`}
    >
      <body className="bg-section-dark overflow-x-hidden font-body antialiased">
        <SmoothScrollProvider>
          {/* <Navbar /> */}
          {children}
          <Footer />
          <FloatingCTAs />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}