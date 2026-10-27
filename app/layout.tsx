import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { SiteHeader } from "@/components/header/site-header";
import { getMainNavigation } from "@/lib/navigation";
import { getOpeningHours } from "@/lib/opening-hours";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const instant = false;

export const metadata: Metadata = {
  title: "Praxis Dr. Hück",
  description: "Praxis Dr. Hück",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [navigation, openingHours] = await Promise.all([
    getMainNavigation(),
    getOpeningHours(),
  ]);

  return (
    <html lang="de" className={`${outfit.className} h-full`}>
      <body className="flex min-h-full flex-col bg-background text-ink">
        <SiteHeader
          desktop={navigation.desktop}
          mobile={navigation.mobile}
          openingHours={openingHours}
        />
        {children}
      </body>
    </html>
  );
}
