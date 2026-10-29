import Image from "next/image";
import Link from "next/link";
import { BookingLink } from "@/components/booking-link";
import { Reveal } from "@/components/reveal";
import type { BookingContent } from "@/lib/service-module";

function BookingButton({ href, label }: { href: string; label: string }) {
  return (
    <BookingLink
      href={href}
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

function PhoneLink({ href, label }: { href: string; label: string }) {
  const className = "header-link inline-flex w-fit items-center gap-pair text-nav";
  const content = (
    <>
      <span className="phone-icon size-icon shrink-0" aria-hidden="true" />
      {label}
    </>
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

export function Booking({ booking }: { booking: BookingContent }) {
  const paragraphs = booking.body
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <Reveal id={booking.anchor} className="bg-background px-gutter py-20">
      <div className="mx-auto grid max-w-column lg:grid-cols-2 lg:items-start lg:gap-x-20">
        <div className="flex flex-col items-start gap-nav">
          <h2 className="text-ink">{booking.headline}</h2>
          {paragraphs.length > 0 ? (
            <div className="flex flex-col gap-pair">
              {paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-base leading-normal font-normal text-ink lg:text-[18px]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          ) : null}
          <div className="flex flex-col items-start gap-nav lg:flex-row lg:items-center lg:gap-gutter">
            <BookingButton href={booking.bookingHref} label={booking.bookingLabel} />
            <PhoneLink href={booking.phoneHref} label={booking.phoneLabel} />
          </div>
        </div>
      </div>
    </Reveal>
  );
}
