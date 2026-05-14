import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource/gloock";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Go2Trip",
  description: "A collaborative trip planning and expense splitting app.",
  icons: {
    icon: "/brand/go2trip-logo.png",
    apple: "/brand/go2trip-logo.png"
  },
  manifest: "/manifest.webmanifest"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4313a0"
};

export default function RootLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
