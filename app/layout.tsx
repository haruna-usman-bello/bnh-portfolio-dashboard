import type { Metadata } from "next";

import { SiteHeader } from "@/components/site-header";

import "./globals.css";

export const metadata: Metadata = {
  title: "Portfolio Intelligence Dashboard",
  description: "Executive portfolio update intake and dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-background font-sans text-foreground">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
