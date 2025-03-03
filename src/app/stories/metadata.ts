import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stories | Tales of Deutsch",
  description: "Explore German stories with interactive translations and word definitions to improve your language skills.",
  openGraph: {
    title: "Stories | Tales of Deutsch",
    description: "Explore German stories with interactive translations and word definitions to improve your language skills.",
    type: "website",
    images: [
      {
        url: "/images/tales-of-deutsch.png",
        width: 1200,
        height: 630,
        alt: "Tales of Deutsch Stories",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stories | Tales of Deutsch",
    description: "Explore German stories with interactive translations and word definitions to improve your language skills.",
    images: ["/images/tales-of-deutsch.png"],
  },
};