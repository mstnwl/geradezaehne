import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import type { SprechzeitenContent } from "@/lib/sprechzeiten";

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

function PhoneLink({ href, label }: { href: string; label: string }) {
  const className = "header-link inline-flex w-fit items-center gap-pair text-nav";
  const content = (
    <>
      <span className="menu-arrow size-icon-lg shrink-0" aria-hidden="true" />
      {label}
    </>
  );

  if (/^(https?:|mailto:|tel:)/i.test(href)) {
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

export function Sprechzeiten({ sprechzeiten }: { sprechzeiten: SprechzeitenContent }) {
  const column = sprechzeiten.image ? "lg:col-start-2" : "lg:col-start-1";

  return (
    <Reveal className="bg-background px-gutter py-20">
      <div className="mx-auto grid max-w-column gap-nav lg:grid-cols-2 lg:items-center lg:gap-x-20">
        <h2 className={`text-headline text-ink ${column}`}>{sprechzeiten.headline}</h2>
        {sprechzeiten.image ? (
          <div className="relative aspect-[7/5] w-full overflow-hidden bg-white lg:col-start-1 lg:row-span-5 lg:row-start-1">
            <Image
              src={sprechzeiten.image.src}
              alt={sprechzeiten.image.alt}
              fill
              sizes="(min-width: 64rem) 35rem, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}
        <div className={`w-max justify-self-start ${column}`}>
          <table className="hours-table text-left text-base leading-normal text-ink lg:text-[18px]">
            <tbody>
              {sprechzeiten.hours.map((row) => (
                <tr key={`${row.day}-${row.morning}`}>
                  <th scope="row" className="text-left font-normal">
                    {row.day}
                  </th>
                  <td>{row.morning}</td>
                  <td>{row.afternoon}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={`text-base leading-normal font-normal text-ink lg:text-[18px] ${column}`}>
          {sprechzeiten.body}
        </p>
        <div className={`justify-self-start ${column}`}>
          <BookingButton href={sprechzeiten.bookingHref} label={sprechzeiten.bookingLabel} />
        </div>
        <div className={`justify-self-start ${column}`}>
          <PhoneLink href={sprechzeiten.phoneHref} label={sprechzeiten.phoneLabel} />
        </div>
      </div>
    </Reveal>
  );
}
