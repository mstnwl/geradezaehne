import { Suspense } from "react";
import { StoryBlocks } from "@/components/story-blocks";
import { getStoryBlocks } from "@/lib/service-module";

async function SosBody() {
  const blocks = await getStoryBlocks("sos");

  return <StoryBlocks blocks={blocks} />;
}

export default function SosPage() {
  return (
    <main>
      <Suspense fallback={null}>
        <SosBody />
      </Suspense>
    </main>
  );
}
