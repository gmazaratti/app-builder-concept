import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Inter, exposed as the --font-inter CSS variable. tokens.css aliases this to
// --font-sans, so swapping the typeface only touches these two spots.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Appening — describe an app, get an app",
  description:
    "Appening is an AI agent that turns a plain-English description into a working starter app.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
