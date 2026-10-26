import Image from "next/image";

export function SubHeader() {
  return (
    <div className="bg-accent px-gutter text-ink">
      <div className="mx-auto flex h-bar max-w-column items-center justify-center lg:justify-between">
        <p className="hidden text-nav lg:block">
          Sprechzeiten heute: 8.30 – 12:00 Uhr und 13.00 – 17.00 Uhr
        </p>
        <div className="flex items-center gap-gutter">
          <a
            href="tel:+496131227266"
            className="inline-flex items-center gap-pair text-nav"
          >
            <Image
              src="/icon-phone.png"
              alt=""
              width={24}
              height={24}
              className="size-icon"
            />
            06131 227266
          </a>
          <a href="#" className="inline-flex items-center gap-pair text-nav">
            <span className="size-icon shrink-0" aria-hidden="true" />
            Termin buchen
          </a>
        </div>
      </div>
    </div>
  );
}
