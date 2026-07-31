import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.GITHUB_PAGES === "true" ? "/NET-deadlines" : "";

export const metadata: Metadata = {
  metadataBase: new URL("https://sertbasn1.github.io"),
  title: "NetDeadlines — Computer Networking Conference Deadlines",
  description: "Live countdowns to computer networking research conference deadlines.",
  icons: { icon: `${basePath}/favicon.svg`, shortcut: `${basePath}/favicon.svg` },
  openGraph: {
    title: "NetDeadlines",
    description: "Computer networking conference deadlines in one place.",
    type: "website",
    url: "https://sertbasn1.github.io/NET-deadlines/",
    images: [`${basePath}/og.png`],
  },
  twitter: { card: "summary_large_image", title: "NetDeadlines", description: "Computer networking conference deadlines in one place.", images: [`${basePath}/og.png`] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
