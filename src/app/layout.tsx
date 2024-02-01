import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "../lib/providers";
import { Nav } from "@/components/nav";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WebLive",
  description: "weblive@everyone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={""}>
      <body className={inter.className}>
        <NextAuthProvider>
          <Nav />
          {children}
          <div className="mt-44 h-64 bg-neutral-300" />
        </NextAuthProvider>
      </body>
    </html>
  );
}
