import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const lato = Lato({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "The News Point - Perspective on the World",
  description: "Unrivaled journalism and expert opinion from The News Point.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(lato.variable, playfair.variable, "font-sans antialiased")}>
        {children}
      </body>
    </html>
  );
}
