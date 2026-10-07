import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

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
      <body className={`font-sans bg-background antialiased ${plusJakartaSans.variable}`}>
        <QueryProvider>
          <TooltipProvider>
            <Toaster richColors position="top-right" />
            {children}
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

