import type { Metadata } from "next";
import { Inter, Rajdhani } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rajdhani",
});

export const metadata: Metadata = {
  title: "The Loch Ness Botanical Society: Hydroponic & Aquaponic Innovation",
  description: "Leading botanical innovation through hydroponic and aquaponic cultivation, advancing sustainable agriculture and plant sciences through The Satellite Project Om and The Perennial Waters Collection.",
  openGraph: {
    title: "The Loch Ness Botanical Society: Hydroponic & Aquaponic Innovation",
    description:
      "The Loch Ness Botanical Society is a pioneering organization in botanical innovation, advancing sustainable agriculture through hydroponic and aquaponic cultivation. We operate The Satellite Project Om and are developing The Perennial Waters Collection to revolutionize plant sciences and sustainable farming practices.",
    type: "website",
    url: "https://portal.thelochnessbotanicalsociety.com",
    images: [], // Handled by dynamic opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: "The Loch Ness Botanical Society: Hydroponic & Aquaponic Innovation",
    description:
      "Join The Loch Ness Botanical Society, a pioneering organization in botanical innovation, as we advance sustainable agriculture through hydroponic and aquaponic cultivation, plant sciences, and cutting-edge botanical research.",
    images: [], // Handled by dynamic opengraph-image.tsx
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* General Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#00bf8a" />

        {/* iOS App Icons */}
        <meta name="apple-mobile-web-app-title" content="TLN" />
        <link rel="apple-touch-icon" href="/Medallions/Small/TLN%20(Small).png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/Medallions/Small/TLN%20(Small).png" />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Standard favicon */}
        <link rel="icon" href="/Medallions/Small/TLN%20(Small).png" />

        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />

        {/* Metadata is handled by the metadata object above and Next.js internal systems */}
        <link rel="canonical" href="https://portal.thelochnessbotanicalsociety.com" />
      </head>
      <body className={`${inter.variable} ${rajdhani.variable} font-sans`}>{children}</body>
    </html>
  );
}
