import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NetDeadlines — Computer Networking Conference Deadlines",
  description: "Live countdowns to computer networking research conference deadlines.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "NetDeadlines",
    description: "Never miss the next hop. Computer networking conference deadlines in one place.",
    type: "website",
    images: ["/og.png"],
  },
  twitter: { card: "summary_large_image", title: "NetDeadlines", description: "Never miss the next hop." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
