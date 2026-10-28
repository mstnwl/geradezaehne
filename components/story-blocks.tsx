import { AgeGroups } from "@/components/age-groups";
import { Hero } from "@/components/hero";
import { ImageTeaser } from "@/components/image-teaser";
import { InfoPanel } from "@/components/info-panel";
import { QuoteBand } from "@/components/quote-band";
import { ServiceModule } from "@/components/service-module";
import { TrustBand } from "@/components/trust-band";
import type { HomeBlock } from "@/lib/service-module";

export function StoryBlocks({ blocks }: { blocks: HomeBlock[] }) {
  return blocks.map((block) => {
    if (block.kind === "hero") {
      return <Hero key={block.hero.id} hero={block.hero} />;
    }

    if (block.kind === "trust-band") {
      return <TrustBand key={block.trust.id} trust={block.trust} />;
    }

    if (block.kind === "service") {
      return <ServiceModule key={block.service.id} service={block.service} />;
    }

    if (block.kind === "quote") {
      return <QuoteBand key={block.quote.id} quote={block.quote} />;
    }

    if (block.kind === "age-groups") {
      return <AgeGroups key={block.ageGroups.id} ageGroups={block.ageGroups} />;
    }

    if (block.kind === "image-teaser") {
      return <ImageTeaser key={block.teaser.id} teaser={block.teaser} />;
    }

    return <InfoPanel key={block.info.id} info={block.info} />;
  });
}
