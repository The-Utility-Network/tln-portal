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
    images: [
      {
        url: "https://storage.googleapis.com/tgl_cdn/images/tlnbanner.png",
        width: 1200,
        height: 630,
        alt: "The Loch Ness Botanical Society Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Loch Ness Botanical Society: Hydroponic & Aquaponic Innovation",
    description:
      "Join The Loch Ness Botanical Society, a pioneering organization in botanical innovation, as we advance sustainable agriculture through hydroponic and aquaponic cultivation, plant sciences, and cutting-edge botanical research.",
    images: [
      {
        url: "https://storage.googleapis.com/tgl_cdn/images/tlnbanner.png",
        alt: "The Loch Ness Botanical Society Banner",
      },
    ],
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
        <meta name="theme-color" content="#00C851" />

        {/* iOS App Icons */}
        <meta name="apple-mobile-web-app-title" content="TLN" />
        <link rel="apple-touch-icon" href="/Medallions/Small/TLN%20(Small).png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/Medallions/Small/TLN%20(Small).png" />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Standard favicon */}
        <link rel="icon" href="/Medallions/Small/TLN%20(Small).png" />

        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />

        {/* Open Graph Meta Tags for Facebook, Discord, LinkedIn, etc. */}
        <meta property="og:title" content="The Loch Ness Botanical Society: Hydroponic & Aquaponic Innovation" />
        <meta property="og:description" content="The Loch Ness Botanical Society is dedicated to botanical innovation through hydroponic and aquaponic cultivation, advancing sustainable agriculture and plant sciences." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://portal.thelochnessbotanicalsociety.com" />
        <meta property="og:image" content="https://storage.googleapis.com/tgl_cdn/images/tlnbanner.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="The Loch Ness Botanical Society Banner" />
        <meta property="og:site_name" content="The Loch Ness Botanical Society" />

        {/* Twitter Card Meta Tags for X.com */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Loch Ness Botanical Society: Hydroponic & Aquaponic Innovation" />
        <meta name="twitter:description" content="The Loch Ness Botanical Society pioneers sustainable agriculture through hydroponic and aquaponic cultivation, plant sciences, and botanical research innovation." />
        <meta name="twitter:image" content="https://storage.googleapis.com/tgl_cdn/images/tlnbanner.png" />
        <meta name="twitter:image:alt" content="The Loch Ness Botanical Society Banner" />

        {/* Additional Metadata for SEO and Rich Links */}
        <meta property="og:locale" content="en_US" />
        <meta property="og:updated_time" content="2024-01-01T00:00:00Z" />
        <meta property="article:author" content="The Loch Ness Botanical Society" />

        {/* Facebook Specific Meta */}
        <meta property="fb:app_id" content="YOUR_FACEBOOK_APP_ID" />

        {/* Extra Metadata for Instagram (Uses Open Graph) */}
        <meta property="instapp:content" content="website" />
        <meta property="instapp:like" content="true" />

        {/* General Meta Tags */}
        <link rel="canonical" href="https://portal.thelochnessbotanicalsociety.com" />
      </head>
      <body className={`${inter.variable} ${rajdhani.variable} font-sans`}>{children}</body>
    </html>
  );
}
