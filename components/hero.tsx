import Image from "next/image";
import { BookingLink } from "@/components/booking-link";
import type { HeroContent } from "@/lib/service-module";

function BookingButton({ href, label, overlay }: { href: string; label: string; overlay: boolean }) {
  return (
    <BookingLink
      href={href}
      overlay={overlay}
      className="booking-button inline-flex h-bar w-fit items-center rounded bg-accent px-gutter text-ink"
    >
      <span className="booking-caption inline-flex items-center gap-pair text-nav">
        <Image
          src="/Icon24_Calendar.svg"
          alt=""
          width={24}
          height={24}
          unoptimized
          className="size-icon shrink-0"
        />
        {label}
      </span>
    </BookingLink>
  );
}

export function Hero({ hero }: { hero: HeroContent }) {
  return (
    <section id={hero.anchor || undefined} className="bg-white">
      {hero.image ? (
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-white lg:aspect-[16/9]">
          <Image
            src={hero.image.src}
            alt={hero.image.alt}
            fill
            preload
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="px-gutter py-20">
        <div className="mx-auto flex max-w-column flex-col items-center gap-nav text-center">
          <h1 className="text-balance text-ink">{hero.headline}</h1>
          <p className="w-full text-base leading-normal font-normal text-ink lg:w-[50vw] lg:max-w-full lg:text-[18px]">
            {hero.copy}
          </p>
          <BookingButton href={hero.buttonHref} label={hero.buttonLabel} overlay={hero.overlay} />
        </div>
      </div>
    </section>
  );
}
