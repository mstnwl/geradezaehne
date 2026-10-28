import { Suspense } from "react";
import { StoryBlocks } from "@/components/story-blocks";
import { getStoryBlocks } from "@/lib/service-module";

async function KarriereBody() {
  const blocks = await getStoryBlocks("karriere");

  return <StoryBlocks blocks={blocks} />;
}

export default function KarrierePage() {
  return (
    <main>
      <Suspense fallback={null}>
        <KarriereBody />
      </Suspense>
    </main>
  );
}
