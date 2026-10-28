import Image from "next/image";
import Link from "next/link";
import type { ContentHeroContent, ServiceImage, ServiceLink } from "@/lib/service-module";

function ContentAnchor({ link }: { link: ServiceLink }) {
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

function ContentImage({ image }: { image: ServiceImage }) {
  return (
    <div className="relative aspect-[7/5] w-full overflow-hidden bg-white lg:col-span-2">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(min-width: 64rem) 75rem, 100vw"
        className="object-cover"
      />
    </div>
  );
}

export function ContentHero({ content }: { content: ContentHeroContent }) {
  const hasHeading = content.eyebrow.length > 0 || content.headline.length > 0;

  return (
    <section className="bg-white px-gutter py-20">
      <div className="mx-auto grid max-w-column gap-y-nav lg:grid-cols-2 lg:gap-x-20">
        {hasHeading ? (
          <div className="flex flex-col gap-pair lg:col-start-1">
            {content.eyebrow ? (
              <p className="text-[12px] font-bold text-ink uppercase tracking-widest">
                {content.eyebrow}
              </p>
            ) : null}
            {content.headline ? (
              <h1 className="text-headline text-ink">{content.headline}</h1>
            ) : null}
          </div>
        ) : null}
        {content.image ? <ContentImage image={content.image} /> : null}
        {content.paragraphs.length > 0 || content.links.length > 0 ? (
          <div className="flex flex-col gap-nav lg:col-start-1">
            {content.paragraphs.length > 0 ? (
              <div className="flex flex-col gap-nav">
                {content.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-base leading-normal font-normal text-ink lg:text-[18px]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : null}
            {content.links.length > 0 ? (
              <ul className="flex flex-col gap-pair">
                {content.links.map((link, index) => (
                  <li key={`${link.name}-${index}`}>
                    <ContentAnchor link={link} />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
