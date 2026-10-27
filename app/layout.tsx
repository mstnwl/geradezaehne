import { Suspense } from "react";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { SiteHeader } from "@/components/header/site-header";
import { getMainNavigation } from "@/lib/navigation";
import { getOpeningHours } from "@/lib/opening-hours";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Praxis Dr. Hück",
  description: "Praxis Dr. Hück",
};

async function SiteHeaderData() {
  const [navigation, openingHours] = await Promise.all([
    getMainNavigation(),
    getOpeningHours(),
  ]);

  return (
    <SiteHeader
      desktop={navigation.desktop}
      mobile={navigation.mobile}
      openingHours={openingHours}
    />
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className={`${outfit.className} h-full`}>
      <body className="flex min-h-full flex-col bg-background text-ink">
        <Suspense fallback={null}>
          <SiteHeaderData />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
