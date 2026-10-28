import Link from "next/link";
import { Reveal } from "@/components/reveal";
import type { InfoPanelContent, ServiceLink } from "@/lib/service-module";

function InfoAnchor({ link }: { link: ServiceLink }) {
  const className = "header-link inline-flex items-center gap-pair text-nav text-white";
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

export function InfoPanel({ info }: { info: InfoPanelContent }) {
  return (
    <Reveal className="bg-ink px-gutter py-20 text-white">
      <div className="mx-auto grid max-w-column lg:grid-cols-2 lg:items-center lg:gap-x-20">
        <div className="flex flex-col gap-nav">
          <div className="flex flex-col gap-pair">
            <p className="text-[12px] font-bold tracking-widest uppercase">{info.eyebrow}</p>
            <h2 className="text-headline">{info.headline}</h2>
          </div>
          <p className="text-base leading-normal font-normal lg:text-[18px]">{info.body}</p>
          {info.links.length > 0 ? (
            <ul className="flex flex-col gap-pair">
              {info.links.map((link, index) => (
                <li key={`${link.name}-${index}`}>
                  <InfoAnchor link={link} />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </Reveal>
  );
}
