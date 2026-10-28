import { Suspense } from "react";
import { StoryBlocks } from "@/components/story-blocks";
import { getStoryBlocks } from "@/lib/service-module";

async function NewsBody() {
  const blocks = await getStoryBlocks("news");

  return <StoryBlocks blocks={blocks} />;
}

export default function NewsPage() {
  return (
    <main>
      <Suspense fallback={null}>
        <NewsBody />
      </Suspense>
    </main>
  );
}
