import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "@/components/NextAuthProvider";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "沖縄の魚図鑑",
  description: "沖縄の美しい魚たちを紹介する図鑑サイトです",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <NextAuthProvider>
          <Header />
          <main className="container mx-auto p-4">
            {children}
          </main>
        </NextAuthProvider>
      </body>
    </html>
  );
}
