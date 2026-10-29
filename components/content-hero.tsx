import Link from "next/link";
import { HeroImage } from "@/components/hero-image";
import { RichText } from "@/components/rich-text";
import type { ContentHeroContent, ServiceLink } from "@/lib/service-module";

function ContentAnchor({ link }: { link: ServiceLink }) {
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

export function ContentHero({ content }: { content: ContentHeroContent }) {
  const hasHeading = content.eyebrow.length > 0 || content.headline.length > 0;
  const hasCopy = content.body.blocks.length > 0 || content.links.length > 0;

  return (
    <section id={content.anchor || undefined} className="bg-white">
      {content.image ? <HeroImage image={content.image} mobile="natural" /> : null}
      {hasHeading || hasCopy ? (
        <div className="px-gutter py-20">
          <div className="mx-auto grid max-w-column lg:grid-cols-2 lg:gap-x-20">
            <div className="flex flex-col gap-nav lg:col-start-1">
              {hasHeading ? (
                <div className="flex flex-col gap-pair">
                  {content.eyebrow ? (
                    <p className="text-[12px] font-bold text-ink uppercase tracking-widest">
                      {content.eyebrow}
                    </p>
                  ) : null}
                  {content.headline ? (
                    <h1 className="text-ink">{content.headline}</h1>
                  ) : null}
                </div>
              ) : null}
              {content.body.blocks.length > 0 ? <RichText document={content.body} /> : null}
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
          </div>
        </div>
      ) : null}
    </section>
  );
}
