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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-white dark:bg-gray-800 transition-colors duration-200`}
      >
        <header className="w-full bg-blue-500 dark:bg-blue-600 p-2 md:p-4 transition-colors duration-200">
          <h1 className="text-xl md:text-4xl text-center text-white font-bold">
            Word Sets to learn
          </h1>
        </header>
        <main className="flex-1 p-2 md:p-6 max-w-3xl mx-auto w-full">
          {children}
        </main>
        <footer className="w-full bg-gray-100 dark:bg-gray-800 py-4 text-center text-gray-500 dark:text-gray-400 transition-colors duration-200">
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
