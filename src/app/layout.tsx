import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Pakeliui — miestas jūsų maršrute",
  description:
    "Vietos žiniomis pagrįstas garso palydovas Vilniaus viešajame transporte.",
};

export const viewport: Viewport = {
  themeColor: "#12231c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lt" suppressHydrationWarning>
      <body className={manrope.variable} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
