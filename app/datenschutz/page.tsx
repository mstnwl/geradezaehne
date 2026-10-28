import { Suspense } from "react";
import { StoryBlocks } from "@/components/story-blocks";
import { getStoryBlocks } from "@/lib/service-module";

async function DatenschutzBody() {
  const blocks = await getStoryBlocks("datenschutz");

  return <StoryBlocks blocks={blocks} />;
}

export default function DatenschutzPage() {
  return (
    <main>
      <Suspense fallback={null}>
        <DatenschutzBody />
      </Suspense>
    </main>
  );
}
