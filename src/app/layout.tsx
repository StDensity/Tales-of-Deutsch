import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PostHogProvider } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://talesofdeutsch.vercel.app"),
  title: {
    default: "Tales of Deutsch | Learn German Through Stories",
    template: "%s | Tales of Deutsch",
  },
  description: "Learn German through interactive stories with translations and word definitions.",
  keywords: ["German", "language learning", "stories", "translations", "interactive learning"],
  authors: [{ name: "Tales of Deutsch Team" }],
  creator: "Tales of Deutsch",
  publisher: "Tales of Deutsch",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://talesofdeutsch.vercel.app/",
    title: "Tales of Deutsch | Learn German Through Stories",
    description: "Learn German through interactive stories with translations and word definitions.",
    siteName: "Tales of Deutsch",
    images: [
      {
        url: "/images/tales-of-deutsch.png",
        width: 1200,
        height: 630,
        alt: "Tales of Deutsch",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tales of Deutsch | Learn German Through Stories",
    description: "Learn German through interactive stories with translations and word definitions.",
    images: ["/images/tales-of-deutsch.png"],
  },
  robots: {
    index: true,
    follow: true,
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
        <meta name="google-site-verification" content="Ic7bfO2dT3gxxxRXOFEsrbaSkCSa0J3UETBjEZIk978" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <PostHogProvider>
          <Header />
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </PostHogProvider>
      </body>
    </html>
  );
}
