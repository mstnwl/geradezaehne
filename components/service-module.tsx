import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import type { ServiceImage, ServiceLink, ServiceModuleContent } from "@/lib/service-module";

function ServiceFrame({ image }: { image: ServiceImage | null }) {
  return (
    <div className="relative aspect-[7/5] w-full overflow-hidden bg-white">
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 64rem) 35rem, 100vw"
          className="object-cover"
        />
      ) : null}
    </div>
  );
}

function ServiceAnchor({ link }: { link: ServiceLink }) {
  const className = "header-link inline-flex items-center gap-pair text-nav";
  const content = (
    <>
      <span className="menu-arrow size-icon shrink-0" aria-hidden="true" />
      {link.name}
    </>
  );

  if (/^(https?:|mailto:|tel:)/i.test(link.href)) {
    return (
      <a href={link.href} className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {content}
    </Link>
  );
}

export function ServiceModule({ service }: { service: ServiceModuleContent }) {
  return (
    <Reveal className="px-gutter py-20">
      <div className="mx-auto flex max-w-column flex-col gap-nav lg:grid lg:grid-cols-2 lg:items-center lg:gap-x-20">
        <div className="hidden lg:block">
          <ServiceFrame image={service.image} />
        </div>
        <div className="contents lg:flex lg:flex-col lg:gap-nav">
          <div className="flex flex-col gap-pair">
            <p className="text-[12px] font-bold text-ink uppercase tracking-widest">
              {service.eyebrow}
            </p>
            <h2 className="text-headline text-ink">{service.headline}</h2>
          </div>
          <div className="lg:hidden">
            <ServiceFrame image={service.image} />
          </div>
          <p className="text-base leading-normal font-normal text-ink lg:text-[18px]">
            {service.text}
          </p>
          <ul className="flex flex-col gap-pair">
            {service.links.map((link, index) => (
              <li key={`${link.name}-${index}`}>
                <ServiceAnchor link={link} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );
}
