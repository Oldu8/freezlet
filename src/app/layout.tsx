import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Freezlet | Free instead of paid service to learn words",
  description: "Learn foreign languages words with free",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="w-full bg-blue-500 p-4">
          <h1 className="text-4xl text-center text-white font-bold">
            Word Sets to learn
          </h1>
        </header>
        <main className="p-6 max-w-3xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
