import Image from "next/image";
import Link from "next/link";
import type { HeroContent } from "@/lib/service-module";

function BookingButton({ href, label }: { href: string; label: string }) {
  const className =
    "booking-button inline-flex h-bar w-fit items-center rounded bg-accent px-gutter text-ink";
  const content = (
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
  );

  if (/^(https?:|mailto:|tel:|#)/i.test(href)) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

export function Hero({ hero }: { hero: HeroContent }) {
  return (
    <section className="bg-white">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-white lg:aspect-[16/9]">
        {hero.image ? (
          <Image
            src={hero.image.src}
            alt={hero.image.alt}
            fill
            preload
            sizes="100vw"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="px-gutter py-20">
        <div className="mx-auto flex max-w-column flex-col items-center gap-nav text-center">
          <h1 className="text-headline text-balance text-ink">{hero.headline}</h1>
          <p className="w-full text-base leading-normal font-normal text-ink lg:w-[50vw] lg:max-w-full lg:text-[18px]">
            {hero.copy}
          </p>
          <BookingButton href={hero.buttonHref} label={hero.buttonLabel} />
        </div>
      </div>
    </section>
  );
}
