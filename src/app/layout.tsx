import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible, Geist_Mono } from "next/font/google";
import "./globals.css";

const atkinson = Atkinson_Hyperlegible({
  variable: "--font-atkinson",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rough.co.nz"),
  title: {
    default: "The Land of Orwen",
    template: "%s · The Land of Orwen",
  },
  description:
    "Original browser idle RPG set in drought-struck Orwen — travel the map, read the journal, and pursue the Rainward Gate.",
  openGraph: {
    type: "website",
    locale: "en_NZ",
    url: "https://rough.co.nz",
    siteName: "The Land of Orwen",
    title: "The Land of Orwen",
    description:
      "Walk Orwen until the sky remembers rain — an original browser idle chronicle.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0a09",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${atkinson.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Plain tag required — next/script rewrites this and AdSense verification fails */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8224711942994508"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
