import Image from "next/image";
import { Reveal } from "@/components/reveal";
import type { TrustBandContent } from "@/lib/service-module";

export function TrustBand({ trust }: { trust: TrustBandContent }) {
  if (trust.stars < 1 && trust.items.length === 0) {
    return null;
  }

  return (
    <Reveal className="bg-beige px-gutter py-bar text-ink">
      <div className="mx-auto flex max-w-column flex-col items-center gap-gutter">
        {trust.stars > 0 ? (
          <div className="flex items-center justify-center gap-pair" aria-hidden="true">
            {Array.from({ length: trust.stars }, (_, index) => (
              <Image
                key={index}
                src="/Icon24_Star.svg"
                alt=""
                width={24}
                height={24}
                unoptimized
                className="size-icon shrink-0"
              />
            ))}
          </div>
        ) : null}
        {trust.items.length > 0 ? (
          <ul className="flex flex-col items-center gap-gutter lg:flex-row lg:justify-center lg:gap-x-bar">
            {trust.items.map((label) => (
              <li
                key={label}
                className="flex items-center gap-pair text-base leading-normal font-normal text-ink lg:text-[18px]"
              >
                <Image
                  src="/Icon16_Checkmark.svg"
                  alt=""
                  width={16}
                  height={16}
                  unoptimized
                  className="size-4 shrink-0"
                />
                {label}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Reveal>
  );
}
