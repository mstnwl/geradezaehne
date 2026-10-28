import { Suspense } from "react";
import { StoryBlocks } from "@/components/story-blocks";
import { getStoryBlocks } from "@/lib/service-module";

async function FaqBody() {
  const blocks = await getStoryBlocks("faq");

  return <StoryBlocks blocks={blocks} />;
}

export default function FaqPage() {
  return (
    <main>
      <Suspense fallback={null}>
        <FaqBody />
      </Suspense>
    </main>
  );
}
