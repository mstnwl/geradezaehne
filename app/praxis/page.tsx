import { Suspense } from "react";
import { StoryBlocks } from "@/components/story-blocks";
import { storyMetadata } from "@/lib/seo";
import { getStoryBlocks } from "@/lib/service-module";

export function generateMetadata() {
  return storyMetadata("Praxis", "/praxis", "praxis");
}

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
