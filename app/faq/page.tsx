import { Suspense } from "react";
import { StoryBlocks } from "@/components/story-blocks";
import { storyMetadata } from "@/lib/seo";
import { getStoryBlocks } from "@/lib/service-module";

export function generateMetadata() {
  return storyMetadata("FAQ", "/faq", "faq");
}

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
