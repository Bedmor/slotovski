import "~/styles/globals.css";

import { type Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Slotovski",
  description: "New generation slot machine simulator",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: "Slotovski",
    description: "New generation slot machine simulator",
    url: siteUrl,
    siteName: "Slotovski",
    images: [
      {
        url: `${siteUrl}/api/og?title=Slotovski`,
        width: 1200,
        height: 630,
        alt: "Slotovski",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Slotovski",
    description: "New generation slot machine simulator",
    images: [`${siteUrl}/api/og?title=Slotovski`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1503967484019606"
          crossorigin="anonymous"
        ></script>
        <meta
          name="google-adsense-account"
          content="ca-pub-1503967484019606"
        ></meta>
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
