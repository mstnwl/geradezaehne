import { Suspense } from "react";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { SiteFooter } from "@/components/footer";
import { HashScroll } from "@/components/hash-scroll";
import { SiteHeader } from "@/components/header/site-header";
import { Sprechzeiten } from "@/components/sprechzeiten";
import { getFooter } from "@/lib/footer";
import { getMainNavigation } from "@/lib/navigation";
import { getOpeningHours } from "@/lib/opening-hours";
import { getSprechzeiten } from "@/lib/sprechzeiten";
import { getHomeBlocks } from "@/lib/service-module";
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
  const [navigation, openingHours, blocks] = await Promise.all([
    getMainNavigation(),
    getOpeningHours(),
    getHomeBlocks(),
  ]);
  const hero = blocks.find((block) => block.kind === "hero");

  return (
    <SiteHeader
      desktop={navigation.desktop}
      mobile={navigation.mobile}
      openingHours={openingHours.lines}
      bookingHref={hero ? hero.hero.buttonHref : "#"}
      bookingOverlay={openingHours.overlay}
    />
  );
}

async function SprechzeitenData() {
  const sprechzeiten = await getSprechzeiten();

  return <Sprechzeiten sprechzeiten={sprechzeiten} />;
}

async function FooterData() {
  const footer = await getFooter();

  return <SiteFooter footer={footer} />;
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className={`${outfit.className} h-full bg-white`}>
      <body className="flex min-h-full flex-col bg-white text-ink">
        <Suspense fallback={null}>
          <SiteHeaderData />
        </Suspense>
        {children}
        <Suspense fallback={null}>
          <SprechzeitenData />
        </Suspense>
        <Suspense fallback={null}>
          <FooterData />
        </Suspense>
        <HashScroll />
      </body>
    </html>
  );
}
