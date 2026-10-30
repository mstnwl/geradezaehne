import { Suspense } from "react";
import { StoryBlocks } from "@/components/story-blocks";
import { storyMetadata } from "@/lib/seo";
import { getStoryBlocks } from "@/lib/service-module";

export function generateMetadata() {
  return storyMetadata("Karriere", "/karriere", "karriere");
}

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
