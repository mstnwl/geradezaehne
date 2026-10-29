import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import type { ImageTeaserContent } from "@/lib/service-module";

function TeaserLink({ href, label }: { href: string; label: string }) {
  const className = "header-link inline-flex items-center gap-pair text-nav text-white";
  const content = (
    <>
      <span className="menu-arrow size-icon shrink-0" aria-hidden="true" />
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

export function ImageTeaser({ teaser }: { teaser: ImageTeaserContent }) {
  return (
    <Reveal id={teaser.anchor} className="relative aspect-[390/421] overflow-hidden bg-white lg:aspect-[1728/760]">
      {teaser.image ? (
        <Image
          src={teaser.image.src}
          alt={teaser.image.alt}
          fill
          unoptimized
          sizes="100vw"
          className="object-cover"
        />
      ) : null}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgb(0 0 0 / ${teaser.overlay}%)` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 flex items-center px-gutter">
        <div className="mx-auto w-full max-w-column">
          <div className="flex max-w-xl flex-col gap-nav text-white">
            <p className="text-[12px] font-bold uppercase tracking-widest">{teaser.eyebrow}</p>
            <h2>{teaser.headline}</h2>
            <p className="text-base leading-normal font-normal lg:text-[18px]">{teaser.text}</p>
            <TeaserLink href={teaser.href} label={teaser.linkLabel} />
          </div>
        </div>
      </div>
    </Reveal>
  );
}
