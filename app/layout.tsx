import type { Metadata } from "next";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ReactQueryProvider from "../services/react-query-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Charlie Meyer's Homepage",
  description: "Welcome to Charlie Meyer's World Wide Web Homepage!",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <TooltipProvider>
        <body
          className="min-h-svh antialiased"
          style={{ fontFamily: "'Times New Roman', 'Georgia', serif" }}
        >
          <ReactQueryProvider>{children}</ReactQueryProvider>
          <Toaster />
        </body>
      </TooltipProvider>
    </html>
  );
}
