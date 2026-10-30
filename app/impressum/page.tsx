import { Suspense } from "react";
import { SiteEnd } from "@/components/site-end";
import { StoryBlocks } from "@/components/story-blocks";
import { storyMetadata } from "@/lib/seo";
import { getStoryBlocks } from "@/lib/service-module";

export function generateMetadata() {
  return storyMetadata("Impressum", "/impressum", "impressum");
}

async function ImpressumBody() {
  const blocks = await getStoryBlocks("impressum");

  return (
    <>
      <StoryBlocks blocks={blocks} />
      <SiteEnd />
    </>
  );
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
