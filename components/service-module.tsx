import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { RichText } from "@/components/rich-text";
import type { ServiceImage, ServiceLink, ServiceModuleContent } from "@/lib/service-module";

function ServiceFrame({ image, portrait }: { image: ServiceImage; portrait: boolean }) {
  return (
    <div
      className={`relative w-full overflow-hidden bg-white ${portrait ? "aspect-[4/5]" : "aspect-[7/5]"}`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(min-width: 64rem) 35rem, 100vw"
        className="object-cover"
      />
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

  if (/^(https?:|mailto:|tel:|#)/i.test(link.href)) {
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

function ServiceCopy({
  service,
  showMobileImage,
}: {
  service: ServiceModuleContent;
  showMobileImage: boolean;
}) {
  return (
    <>
      <div className="flex flex-col gap-pair">
        {service.eyebrow ? (
          <p className="text-[12px] font-bold text-ink uppercase tracking-widest">
            {service.eyebrow}
          </p>
        ) : null}
        {service.headline ? <h2 className="text-ink">{service.headline}</h2> : null}
      </div>
      {showMobileImage && service.image ? (
        <div className="lg:hidden">
          <ServiceFrame image={service.image} portrait={service.portrait} />
        </div>
      ) : null}
      {service.richText && service.richText.blocks.length > 0 ? (
        <RichText document={service.richText} />
      ) : service.text.trim() ? (
        <div className="flex flex-col gap-pair">
          {service.text
            .split(/\n+/)
            .map((paragraph) => paragraph.trim())
            .filter(Boolean)
            .map((paragraph) => (
              <p
                key={paragraph}
                className="text-base leading-normal font-normal text-ink lg:text-[18px]"
              >
                {paragraph}
              </p>
            ))}
        </div>
      ) : null}
      <ul className="flex flex-col gap-pair">
        {service.links.map((link, index) => (
          <li key={`${link.name}-${index}`}>
            <ServiceAnchor link={link} />
          </li>
        ))}
      </ul>
    </>
  );
}

export function ServiceModule({
  service,
  imageAlign = "center",
}: {
  service: ServiceModuleContent;
  imageAlign?: "center" | "start";
}) {
  if (!service.image) {
    return (
      <Reveal id={service.anchor} className="bg-white px-gutter py-20">
        <div className="mx-auto grid max-w-column lg:grid-cols-2 lg:items-center lg:gap-x-20">
          <div className="flex flex-col gap-nav">
            <ServiceCopy service={service} showMobileImage={false} />
          </div>
        </div>
      </Reveal>
    );
  }

  return (
    <Reveal id={service.anchor} className="bg-white px-gutter py-20">
      <div
        className={`mx-auto flex max-w-column flex-col gap-nav lg:grid lg:grid-cols-2 lg:gap-x-20 ${
          imageAlign === "start" ? "lg:items-start" : "lg:items-center"
        }`}
      >
        <div className="hidden lg:block">
          <ServiceFrame image={service.image} portrait={service.portrait} />
        </div>
        <div className="contents lg:flex lg:flex-col lg:gap-nav">
          <ServiceCopy service={service} showMobileImage />
        </div>
      </div>
    </Reveal>
  );
}
