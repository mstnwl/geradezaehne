import Image from "next/image";
import { Reveal } from "@/components/reveal";
import type { GalleryContent, GalleryImage } from "@/lib/service-module";

function GalleryFigure({ item, fallback }: { item: GalleryImage; fallback: string }) {
  return (
    <li>
      <figure className="flex flex-col gap-pair">
        {item.image || item.imageMobile ? (
          <div
            className={`relative aspect-[16/9] w-full overflow-hidden bg-white${item.image ? "" : " lg:hidden"}`}
          >
            {item.imageMobile ? (
              <Image
                src={item.imageMobile.src}
                alt={item.imageMobile.alt || item.image?.alt || item.caption || fallback}
                fill
                unoptimized
                sizes="100vw"
                className={item.image ? "object-cover lg:hidden" : "object-cover"}
              />
            ) : null}
            {item.image ? (
              <Image
                src={item.image.src}
                alt={item.image.alt || item.caption || fallback}
                fill
                unoptimized
                sizes="(min-width: 64rem) 75rem, 100vw"
                className={item.imageMobile ? "hidden object-cover lg:block" : "object-cover"}
              />
            ) : null}
          </div>
        ) : null}
        {item.caption ? (
          <figcaption className="text-base leading-normal font-normal text-ink">
            {item.caption}
          </figcaption>
        ) : null}
      </figure>
    </li>
  );
}

export function Gallery({ gallery }: { gallery: GalleryContent }) {
  const paragraphs = gallery.body
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <Reveal id={gallery.anchor} className="bg-white px-gutter py-20">
      <div className="mx-auto flex max-w-column flex-col gap-12">
        {gallery.headline || paragraphs.length > 0 ? (
          <div className="grid lg:grid-cols-2 lg:gap-x-20">
            <div className="flex flex-col gap-nav">
              {gallery.headline ? (
                <h2 className="text-ink">{gallery.headline}</h2>
              ) : null}
              {paragraphs.length > 0 ? (
                <div className="flex flex-col gap-pair">
                  {paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-base leading-normal font-normal text-ink lg:text-[18px]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
        {gallery.images.length > 0 ? (
          <ul className="flex flex-col gap-12">
            {gallery.images.map((item, index) => (
              <GalleryFigure key={`${item.caption}-${index}`} item={item} fallback={gallery.headline} />
            ))}
          </ul>
        ) : null}
      </div>
    </Reveal>
  );
}
