import { Suspense } from "react";
import { SiteEnd } from "@/components/site-end";
import { StoryBlocks } from "@/components/story-blocks";
import { storyMetadata } from "@/lib/seo";
import { getStoryBlocks } from "@/lib/service-module";

export function generateMetadata() {
  return storyMetadata("Fallbeispiele", "/fallbeispiele", "fallbeispiele");
}

async function FallbeispieleBody() {
  const blocks = await getStoryBlocks("fallbeispiele");

  return (
    <>
      <StoryBlocks blocks={blocks} />
      <SiteEnd />
    </>
  );
}

export default function FallbeispielePage() {
  return (
    <main>
      <Suspense fallback={null}>
        <FallbeispieleBody />
      </Suspense>
    </main>
  );
}
