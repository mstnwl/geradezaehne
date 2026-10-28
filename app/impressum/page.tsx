import { Suspense } from "react";
import { StoryBlocks } from "@/components/story-blocks";
import { getStoryBlocks } from "@/lib/service-module";

async function ImpressumBody() {
  const blocks = await getStoryBlocks("impressum");

  return <StoryBlocks blocks={blocks} />;
}

export default function ImpressumPage() {
  return (
    <main>
      <Suspense fallback={null}>
        <ImpressumBody />
      </Suspense>
    </main>
  );
}
