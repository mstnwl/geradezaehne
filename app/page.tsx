import { Suspense } from "react";
import { QuoteBand } from "@/components/quote-band";
import { ServiceModule } from "@/components/service-module";
import { getHomeBlocks } from "@/lib/service-module";

async function HomeBody() {
  const blocks = await getHomeBlocks();

  return blocks.map((block) =>
    block.kind === "service" ? (
      <ServiceModule key={block.service.id} service={block.service} />
    ) : (
      <QuoteBand key={block.quote.id} quote={block.quote} />
    ),
  );
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
