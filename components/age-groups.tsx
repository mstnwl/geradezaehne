import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import type { AgeGroupsContent, ServiceImage, ServiceLink } from "@/lib/service-module";

function imageSize(src: string) {
  const match = src.match(/\/(\d+)x(\d+)\//);

  if (!match) {
    return null;
  }

  const width = Number(match[1]);
  const height = Number(match[2]);

  if (!width || !height) {
    return null;
  }

  return { width, height };
}

function AgeGroupImage({ image }: { image: ServiceImage }) {
  const size = imageSize(image.src);
  const className = "h-auto w-4/5";

  if (!size) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={image.src} alt={image.alt} className={className} />
    );
  }

  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={size.width}
      height={size.height}
      unoptimized
      className={className}
    />
  );
}

function TreatmentLink({ link }: { link: ServiceLink }) {
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

export function AgeGroups({ ageGroups }: { ageGroups: AgeGroupsContent }) {
  return (
    <Reveal id={ageGroups.anchor} className="bg-white px-gutter py-20">
      <div className="mx-auto grid max-w-column gap-12 lg:grid-cols-3 lg:gap-x-20">
        {ageGroups.groups.map((group, index) => (
          <article key={`${group.headline}-${index}`} className="flex flex-col gap-nav">
            <h3 className="text-ink">{group.headline}</h3>
            {group.image ? <AgeGroupImage image={group.image} /> : null}
            <div className="flex flex-col gap-pair">
              {group.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-base leading-normal font-normal text-ink lg:text-[18px]">
                  {paragraph}
                </p>
              ))}
            </div>
            {group.treatmentsLabel || group.treatments.length > 0 ? (
              <div className="flex flex-col gap-pair">
                {group.treatmentsLabel ? (
                  <p className="text-base leading-normal font-normal text-ink lg:text-[18px]">
                    {group.treatmentsLabel}
                  </p>
                ) : null}
                {group.treatments.length > 0 ? (
                  <ul className="flex flex-col gap-pair">
                    {group.treatments.map((link) => (
                      <li key={link.name}>
                        <TreatmentLink link={link} />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </Reveal>
  );
}
