import Image from "next/image";
import { Reveal } from "@/components/reveal";
import type { CasePhoto, CaseStudyContent } from "@/lib/service-module";

function paragraphsOf(value: string) {
  return value
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function CaseCopy({ label, text }: { label: string; text: string }) {
  const paragraphs = paragraphsOf(text);

  if (!label && paragraphs.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-pair">
      {label ? (
        <p className="text-base leading-normal font-medium text-ink lg:text-[18px]">{label}</p>
      ) : null}
      {paragraphs.map((paragraph) => (
        <p
          key={paragraph}
          className="text-base leading-normal font-normal text-ink lg:text-[18px]"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function imageSize(src: string) {
  const match = src.match(/\/(\d+)x(\d+)\//);

  if (!match) {
    return null;
  }

  return { width: Number(match[1]), height: Number(match[2]) };
}

function CaseImage({ src, alt }: { src: string; alt: string }) {
  const size = imageSize(src);

  if (!size) {
    return <img src={src} alt={alt} className="h-auto w-full" />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size.width}
      height={size.height}
      unoptimized
      sizes="(min-width: 64rem) 35rem, 100vw"
      className="h-auto w-full"
    />
  );
}

function CaseFigure({ photo }: { photo: CasePhoto }) {
  return (
    <li>
      <figure className="flex flex-col gap-pair">
        {photo.image ? (
          <CaseImage src={photo.image.src} alt={photo.image.alt || photo.caption} />
        ) : null}
        {photo.caption ? (
          <figcaption className="text-base leading-normal font-normal text-ink">
            {photo.caption}
          </figcaption>
        ) : null}
      </figure>
    </li>
  );
}

export function CaseStudy({ caseStudy }: { caseStudy: CaseStudyContent }) {
  const hasHeading = caseStudy.eyebrow.length > 0 || caseStudy.headline.length > 0;
  const hasCopy =
    caseStudy.situationLabel.length > 0 ||
    caseStudy.situation.length > 0 ||
    caseStudy.treatmentLabel.length > 0 ||
    caseStudy.treatment.length > 0 ||
    caseStudy.resultLabel.length > 0 ||
    caseStudy.result.length > 0;

  if (!hasHeading && !hasCopy && caseStudy.photos.length === 0) {
    return null;
  }

  return (
    <Reveal id={caseStudy.anchor} className="bg-white px-gutter py-20">
      <div className="mx-auto flex max-w-column flex-col gap-12">
        {hasHeading || hasCopy ? (
          <div className="flex flex-col gap-nav">
            {hasHeading ? (
              <div className="grid lg:grid-cols-2 lg:gap-x-20">
                <div className="flex flex-col gap-pair">
                  {caseStudy.eyebrow ? (
                    <p className="text-[12px] font-bold text-ink uppercase tracking-widest">
                      {caseStudy.eyebrow}
                    </p>
                  ) : null}
                  {caseStudy.headline ? (
                    <h2 className="text-ink">{caseStudy.headline}</h2>
                  ) : null}
                </div>
              </div>
            ) : null}
            {hasCopy ? (
              <div className="grid grid-cols-1 gap-nav lg:grid-cols-3 lg:gap-x-20">
                <CaseCopy label={caseStudy.situationLabel} text={caseStudy.situation} />
                <CaseCopy label={caseStudy.treatmentLabel} text={caseStudy.treatment} />
                <CaseCopy label={caseStudy.resultLabel} text={caseStudy.result} />
              </div>
            ) : null}
          </div>
        ) : null}
        {caseStudy.photos.length > 0 ? (
          <ul className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-x-20">
            {caseStudy.photos.map((photo, index) => (
              <CaseFigure key={`${photo.caption}-${index}`} photo={photo} />
            ))}
          </ul>
        ) : null}
      </div>
    </Reveal>
  );
}
