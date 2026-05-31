import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hombru.er",
  description: "Journaling coffee web for home brewer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-background ${plusJakartaSans.variable}`}>
        <header className="bg-white shadow">
          <nav className="max-w-7xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">My App</h1>
          </nav>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
