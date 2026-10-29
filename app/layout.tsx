import { Suspense } from "react";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { BookingOverlayProvider } from "@/components/booking-link";
import { SiteFooter } from "@/components/footer";
import { HashScroll } from "@/components/hash-scroll";
import { SiteHeader } from "@/components/header/site-header";
import { Sprechzeiten } from "@/components/sprechzeiten";
import { getFooter } from "@/lib/footer";
import { getMainNavigation } from "@/lib/navigation";
import { getOpeningHours } from "@/lib/opening-hours";
import { getSprechzeiten } from "@/lib/sprechzeiten";
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
      openingHours={openingHours.lines}
      phoneNumber={openingHours.phoneNumber}
      phoneHref={openingHours.phoneHref}
      bookingLabel={openingHours.bookingLabel}
      bookingHref={openingHours.bookingHref}
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
        <BookingOverlayProvider>
          <Suspense fallback={null}>
            <SiteHeaderData />
          </Suspense>
          <div className="min-h-dvh">{children}</div>
          <Suspense fallback={null}>
            <SprechzeitenData />
          </Suspense>
          <Suspense fallback={null}>
            <FooterData />
          </Suspense>
          <HashScroll />
        </BookingOverlayProvider>
      </body>
    </html>
  );
}
