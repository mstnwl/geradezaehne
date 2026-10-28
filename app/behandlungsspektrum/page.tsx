import { Suspense } from "react";
import { StoryBlocks } from "@/components/story-blocks";
import { getStoryBlocks } from "@/lib/service-module";

async function BehandlungsspektrumBody() {
  const blocks = await getStoryBlocks("behandlungsspektrum");

  return <StoryBlocks blocks={blocks} />;
}

export default function BehandlungsspektrumPage() {
  return (
    <main>
      <Suspense fallback={null}>
        <BehandlungsspektrumBody />
      </Suspense>
    </main>
  );
}
