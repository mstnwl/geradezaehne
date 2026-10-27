import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import type { FooterContent, FooterLink } from "@/lib/footer";

function FooterAnchor({ link }: { link: FooterLink }) {
  const className = "header-link inline-flex w-fit items-center gap-pair text-nav";
  const content = (
    <>
      <span className="menu-arrow size-icon-lg shrink-0" aria-hidden="true" />
      {link.label}
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

export function SiteFooter({ footer }: { footer: FooterContent }) {
  const lines = [
    footer.practiceName,
    footer.specialty,
    footer.street,
    footer.city,
    footer.phone,
    footer.fax,
    footer.email,
  ];

  return (
    <Reveal className="bg-background px-gutter py-20 text-ink">
      <div className="mx-auto grid max-w-column gap-12 lg:grid-cols-4 lg:items-start lg:gap-x-12">
        <div className="flex flex-col gap-nav">
          <Image src="/Logomark.svg" alt="" width={80} height={56} unoptimized />
          <address className="flex flex-col not-italic text-base leading-normal font-normal lg:text-[18px]">
            {lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
        </div>
        {footer.groups.map((group) => (
          <div key={group.title} className="flex flex-col gap-nav">
            <p className="text-base leading-normal font-normal lg:text-[18px]">{group.title}</p>
            <ul className="flex flex-col gap-menu">
              {group.links.map((link) => (
                <li key={link.label}>
                  <FooterAnchor link={link} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
