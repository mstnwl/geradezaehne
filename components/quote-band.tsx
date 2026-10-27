import Image from "next/image";
import type { QuoteContent } from "@/lib/service-module";

function quotedName(name: string) {
  const bare = name.trim().replace(/^[–—-]\s*/, "");

  return `– ${bare}`;
}

export function QuoteBand({ quote }: { quote: QuoteContent }) {
  return (
    <section className="bg-ink px-gutter py-bar text-white">
      <figure className="mx-auto flex max-w-column flex-col items-center gap-8 text-center">
        <Image src="/Logomark.svg" alt="" width={80} height={56} unoptimized />
        <blockquote className="text-quote max-w-lg">
          <p>{quote.quote}</p>
        </blockquote>
        <figcaption className="text-base leading-normal font-normal">
          {quotedName(quote.name)}
        </figcaption>
      </figure>
    </section>
  );
}
