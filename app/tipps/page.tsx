import { Suspense } from "react";
import { SiteEnd } from "@/components/site-end";
import { StoryBlocks } from "@/components/story-blocks";
import { storyMetadata } from "@/lib/seo";
import { getStoryBlocks } from "@/lib/service-module";

export function generateMetadata() {
  return storyMetadata("Tipps", "/tipps", "tipps");
}

async function TippsBody() {
  const blocks = await getStoryBlocks("tipps");

  return (
    <>
      <StoryBlocks blocks={blocks} />
      <SiteEnd />
    </>
  );
}

export default function TippsPage() {
  return (
    <main>
      <Suspense fallback={null}>
        <TippsBody />
      </Suspense>
    </main>
  );
}
