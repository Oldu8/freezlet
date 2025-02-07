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
  description: "Learn foreign languages words for free",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <header className="w-full bg-blue-500 p-4">
          <h1 className="text-4xl text-center text-white font-bold">
            Word Sets to learn
          </h1>
        </header>
        <main className="flex-1 p-6 max-w-3xl mx-auto w-full">{children}</main>
        <footer className="w-full bg-gray-100 py-4 text-center text-gray-500">
          <p>Made by Oldu.</p>
          <p>
            &copy; {new Date().getFullYear()} Your Study App. All rights
            reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
