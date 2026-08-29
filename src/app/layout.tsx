import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible, Geist_Mono } from "next/font/google";
import { AdSenseScript } from "@/components/site/adsense-script";
import { AppModeHint } from "@/components/site/app-mode-hint";
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
    default: "rough",
    template: "%s · rough",
  },
  description:
    "Original browser idle RPG set in drought-struck rough — travel the map, read the journal, and pursue the Rainward Gate.",
  openGraph: {
    type: "website",
    locale: "en_NZ",
    url: "https://rough.co.nz",
    siteName: "rough",
    title: "rough",
    description:
      "Walk rough until the sky remembers rain — an original browser idle chronicle.",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "rough",
    statusBarStyle: "black-translucent",
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
        <AdSenseScript />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <AppModeHint />
        {children}
      </body>
    </html>
  );
}
