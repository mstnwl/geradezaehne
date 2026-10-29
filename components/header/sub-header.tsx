import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { BookingLink } from "@/components/booking-link";

function percent(value: number) {
  return Number(value.toFixed(3));
}

function hoursKeyframes(count: number) {
  const fadeIn = percent(10.5 / count);
  const hold = percent(100 / count);
  const fadeOut = percent(111 / count);

  return `@keyframes hours-swap {
    0% { opacity: 0; transform: translateY(var(--spacing-pair)); }
    ${fadeIn}% { opacity: 1; transform: translateY(0); }
    ${hold}% { opacity: 1; transform: translateY(0); }
    ${fadeOut}% { opacity: 0; transform: translateY(calc(var(--spacing-pair) * -1)); }
    100% { opacity: 0; transform: translateY(var(--spacing-pair)); }
  }`;
}

function PhoneAction({ href, label }: { href: string; label: string }) {
  const className = "action-link flex items-center justify-center gap-pair text-nav whitespace-nowrap";
  const content: ReactNode = (
    <>
      <Image
        src="/Icon24_Phone.svg"
        alt=""
        width={24}
        height={24}
        unoptimized
        className="size-icon"
      />
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

export function SubHeader({
  lines,
  phoneNumber,
  phoneHref,
  bookingLabel,
  bookingHref,
  bookingOverlay,
}: {
  lines: string[];
  phoneNumber: string;
  phoneHref: string;
  bookingLabel: string;
  bookingHref: string;
  bookingOverlay: boolean;
}) {
  const count = lines.length;
  const cycling = count > 1;

  return (
    <div className="sticky top-0 z-10">
      <div className="action-bar enter enter-3 bg-accent text-ink lg:px-gutter">
        {cycling ? <style>{hoursKeyframes(count)}</style> : null}
        <div className="flex h-bar items-center lg:mx-auto lg:max-w-column lg:justify-between">
          <p
            className={`hours hidden text-nav font-normal whitespace-nowrap lg:grid${cycling ? " hours-cycle" : ""}`}
            style={{ "--hours-count": count } as CSSProperties}
          >
            {lines.map((line, index) => (
              <span
                key={`${index}-${line}`}
                className="hours-line"
                style={{ "--hours-index": index } as CSSProperties}
              >
                {line}
              </span>
            ))}
          </p>
          <div className="grid h-full w-full grid-cols-2 items-center lg:flex lg:w-auto lg:gap-gutter">
            <PhoneAction href={phoneHref} label={phoneNumber} />
            <BookingLink
              href={bookingHref}
              overlay={bookingOverlay}
              className="action-link flex items-center justify-center gap-pair text-nav whitespace-nowrap"
            >
              <Image
                src="/Icon24_Calendar.svg"
                alt=""
                width={24}
                height={24}
                unoptimized
                className="size-icon shrink-0"
              />
              {bookingLabel}
            </BookingLink>
          </div>
        </div>
      </div>
    </div>
  );
}
