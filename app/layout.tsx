import { Suspense } from "react";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { BookingOverlayProvider } from "@/components/booking-link";
import { HashScroll } from "@/components/hash-scroll";
import { SiteHeader } from "@/components/header/site-header";
import { getMainNavigation } from "@/lib/navigation";
import { getOpeningHours } from "@/lib/opening-hours";
import { siteDescription, siteName, siteOrigin } from "@/lib/seo";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: { absolute: siteName },
  description: siteDescription,
  openGraph: {
    siteName,
    type: "website",
    locale: "de_DE",
    title: siteName,
    description: siteDescription,
  },
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

function HeaderFallback() {
  return (
    <div aria-hidden="true">
      <div className="h-header" />
      <div className="h-bar" />
    </div>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className={`${outfit.className} h-full bg-white`}>
      <body className="flex min-h-full flex-col bg-white text-ink">
        <BookingOverlayProvider>
          <Suspense fallback={<HeaderFallback />}>
            <SiteHeaderData />
          </Suspense>
          {children}
          <HashScroll />
        </BookingOverlayProvider>
      </body>
    </html>
  );
}
