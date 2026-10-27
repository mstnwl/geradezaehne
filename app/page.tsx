import { Suspense } from "react";
import { AgeGroups } from "@/components/age-groups";
import { QuoteBand } from "@/components/quote-band";
import { ServiceModule } from "@/components/service-module";
import { getHomeBlocks, type HomeBlock } from "@/lib/service-module";

function renderBlock(block: HomeBlock) {
  if (block.kind === "service") {
    return <ServiceModule key={block.service.id} service={block.service} />;
  }

  if (block.kind === "quote") {
    return <QuoteBand key={block.quote.id} quote={block.quote} />;
  }

  return <AgeGroups key={block.ageGroups.id} ageGroups={block.ageGroups} />;
}

async function HomeBody() {
  const blocks = await getHomeBlocks();

  return blocks.map((block) => renderBlock(block));
}

export default function Home() {
  return (
    <main>
      <Suspense fallback={null}>
        <HomeBody />
      </Suspense>
    </main>
  );
}
