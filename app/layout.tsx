import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { SiteHeader } from "@/components/header/site-header";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Praxis Dr. Hück",
  description: "Praxis Dr. Hück",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className={`${outfit.className} h-full`}>
      <body className="flex min-h-full flex-col bg-background text-ink">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
