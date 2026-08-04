import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CoE Department Portal",
  description: "CPEN 208 Project 1 - Computer Engineering Department student portal",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
