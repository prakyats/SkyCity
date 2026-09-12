import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Instrument_Sans } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import { Footer } from "@/components/layout/Footer";
import { FloatingCTAs } from "@/components/ui/FloatingCTAs";
import LayoutClient from "@/components/layout/LayoutClient";

// ── Typography ────────────────────────────────────────────────────────────────
// Instrument Serif: a narrow, high-contrast display face. Set very large it
// has the vertical stress of a tall building, which is the whole subject.
// Instrument Sans is its companion, used for everything that is read rather
// than looked at. One family in two voices, so the page never feels borrowed.
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
  preload: true,
});

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Yamuna Sky City | South India's Tallest Sea-View Tower, Mangalore",
  description:
    "296 all sea-facing luxury apartments at Yamuna Sky City, Mangalore. GF+60 floors on NH-66 corridor, 300m from the Arabian Sea. RERA: PRM/KA/RERA/1257/334/PR/171023/006331.",
  keywords:
    "Yamuna Sky City, luxury apartments Mangalore, sea view flats, coastal living Karnataka, NH-66 apartments, RERA registered Mangalore",
  openGraph: {
    title: "Yamuna Sky City | Luxury Sea-View Tower, Mangalore",
    description:
      "South India's tallest residential tower — 296 sea-facing apartments, GF+60 floors, 300m from the Arabian Sea.",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://res.cloudinary.com/drzbbbncs/image/upload/f_auto,q_auto,w_1200/v1777554903/hero-poster_emnfvb.jpg",
        width: 1200,
        height: 630,
        alt: "Yamuna Sky City, Mangalore",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yamuna Sky City | Luxury Sea-View Tower",
    description: "South India's tallest residential tower, Mangalore.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0A0C0E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link
          rel="preload"
          as="image"
          href="https://res.cloudinary.com/drzbbbncs/image/upload/f_auto,q_auto:eco,w_1920/v1777554903/hero-poster_emnfvb.jpg"
          fetchPriority="high"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateListing",
              "name": "Yamuna Sky City",
              "description": "South India's Tallest Sea View Residential Tower — 296 luxury apartments, GF+60 floors, NH-66 Mangalore",
              "url": "https://sky-city-yamuna.vercel.app",
              "image": "https://res.cloudinary.com/drzbbbncs/image/upload/f_auto,q_auto,w_1200/v1777554903/hero-poster_emnfvb.jpg",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "NH-66 Corridor, Surathkal",
                "addressLocality": "Mangalore",
                "addressRegion": "Karnataka",
                "postalCode": "575014",
                "addressCountry": "IN"
              },
              "numberOfRooms": "296",
              "floorSize": { "@type": "QuantitativeValue", "value": 60, "unitText": "floors" },
              "offers": { "@type": "Offer", "availability": "https://schema.org/InStock" },
              "broker": {
                "@type": "RealEstateAgent",
                "name": "Yamuna Homes and Design Private Limited",
                "telephone": "+91-88844-39155"
              }
            })
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <LayoutClient>
          <SmoothScrollProvider>
            {children}
            <Footer />
            <FloatingCTAs />
          </SmoothScrollProvider>
        </LayoutClient>
      </body>
    </html>
  );
}
