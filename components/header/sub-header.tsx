import Image from "next/image";

export function SubHeader() {
  return (
    <div className="enter enter-3 bg-accent text-ink lg:px-gutter">
      <div className="flex h-bar items-center lg:mx-auto lg:max-w-column lg:justify-between">
        <p className="hidden text-nav font-normal lg:block">
          Sprechzeiten heute: 8.30 – 12:00 Uhr und 13.00 – 17.00 Uhr
        </p>
        <div className="grid h-full w-full grid-cols-2 items-center lg:flex lg:w-auto lg:gap-gutter">
          <a
            href="tel:+496131227266"
            className="header-link flex items-center justify-center gap-pair text-nav whitespace-nowrap"
          >
            <Image
              src="/Icon24_Phone.svg"
              alt=""
              width={24}
              height={24}
              unoptimized
              className="size-icon"
            />
            06131 227266
          </a>
          <a
            href="#"
            className="header-link flex items-center justify-center gap-pair text-nav whitespace-nowrap"
          >
            <Image
              src="/Icon24_Calendar.svg"
              alt=""
              width={24}
              height={24}
              unoptimized
              className="size-icon shrink-0"
            />
            Termin buchen
          </a>
        </div>
      </div>
    </div>
  );
}
