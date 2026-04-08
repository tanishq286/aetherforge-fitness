import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "AetherForge Fitness | Master Your Strength",
  description: "Elite power and performance training facility.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <body className={`${barlow.className} ${barlowCondensed.className} antialiased bg-[#080808] text-[#e8e8e2]`}>
        {children}
      </body>
    </html>
  );
}
