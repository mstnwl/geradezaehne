import { Suspense } from "react";
import { StoryBlocks } from "@/components/story-blocks";
import { getStoryBlocks } from "@/lib/service-module";

async function KontaktBody() {
  const blocks = await getStoryBlocks("kontakt");

  return <StoryBlocks blocks={blocks} />;
}

export default function KontaktPage() {
  return (
    <main>
      <Suspense fallback={null}>
        <KontaktBody />
      </Suspense>
    </main>
  );
}
