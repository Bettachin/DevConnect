import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import LayoutShell from "@/components/layout-shell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DevConnect",
  description: "Developer Directory and Blog Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
