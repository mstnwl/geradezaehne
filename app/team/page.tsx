import { Suspense } from "react";
import { StoryBlocks } from "@/components/story-blocks";
import { getStoryBlocks } from "@/lib/service-module";

async function TeamBody() {
  const blocks = await getStoryBlocks("team");

  return <StoryBlocks blocks={blocks} />;
}

export default function TeamPage() {
  return (
    <main>
      <Suspense fallback={null}>
        <TeamBody />
      </Suspense>
    </main>
  );
}
