import Image from "next/image";
import { BookingLink } from "@/components/booking-link";
import { Reveal } from "@/components/reveal";
import type { FooterContent, FooterLink } from "@/lib/footer";

function FooterAnchor({ link }: { link: FooterLink }) {
  return (
    <BookingLink
      href={link.href}
      overlay={link.overlay === true}
      className="header-link inline-flex w-fit items-center gap-pair text-nav"
    >
      <span className="menu-arrow size-icon shrink-0" aria-hidden="true" />
      {link.label}
    </BookingLink>
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
    <Reveal className="bg-beige px-gutter py-20 text-ink">
      <div className="mx-auto grid max-w-column gap-12 lg:grid-cols-4 lg:items-start lg:gap-x-12 lg:gap-y-nav">
        <div className="flex flex-col gap-nav lg:contents">
          <Image
            src="/LogomarkFooter.svg"
            alt=""
            width={60}
            height={40}
            unoptimized
            className="lg:col-start-1 lg:row-start-1"
          />
          <address className="flex flex-col not-italic text-base leading-normal font-normal lg:col-start-1 lg:row-start-2 lg:text-[18px]">
            {lines.map((line) => (
              <span key={line} className={line === footer.phone ? "mt-gutter" : undefined}>
                {line}
              </span>
            ))}
          </address>
        </div>
        {footer.groups.map((group, index) => (
          <div
            key={group.title}
            className={`flex flex-col gap-nav ${
              [
                "lg:col-start-2 lg:row-start-2",
                "lg:col-start-3 lg:row-start-2",
                "lg:col-start-4 lg:row-start-2",
              ][index] ?? ""
            }`}
          >
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
