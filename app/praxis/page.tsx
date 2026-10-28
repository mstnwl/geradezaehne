import { Suspense } from "react";
import { StoryBlocks } from "@/components/story-blocks";
import { getStoryBlocks } from "@/lib/service-module";

async function PraxisBody() {
  const blocks = await getStoryBlocks("praxis");

  return <StoryBlocks blocks={blocks} />;
}

export default function PraxisPage() {
  return (
    <main>
      <Suspense fallback={null}>
        <PraxisBody />
      </Suspense>
    </main>
  );
}
