import { Suspense } from "react";
import { StoryBlocks } from "@/components/story-blocks";
import { getStoryBlocks } from "@/lib/service-module";

async function TippsBody() {
  const blocks = await getStoryBlocks("tipps");

  return <StoryBlocks blocks={blocks} />;
}

export default function TippsPage() {
  return (
    <main>
      <Suspense fallback={null}>
        <TippsBody />
      </Suspense>
    </main>
  );
}
