import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Sky City | Sea View Homes",
  description: "Where every day feels like a holiday. Explore luxury sea view homes at Sky City.",
};

import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import { Footer } from '@/components/layout/Footer';
import { FloatingCTAs } from '@/components/ui/FloatingCTAs';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://cdn.yoursite.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-[#0a0a0a] overflow-x-hidden`}>
        <SmoothScrollProvider>
          {children}
          <Footer />
          <FloatingCTAs />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
