import { Suspense } from "react";
import { SiteEnd } from "@/components/site-end";
import { StoryBlocks } from "@/components/story-blocks";
import { storyMetadata } from "@/lib/seo";
import { getStoryBlocks } from "@/lib/service-module";

export function generateMetadata() {
  return storyMetadata("Behandlungsspektrum", "/behandlungsspektrum", "behandlungsspektrum");
}

async function BehandlungsspektrumBody() {
  const blocks = await getStoryBlocks("behandlungsspektrum");

  return (
    <>
      <StoryBlocks blocks={blocks} />
      <SiteEnd />
    </>
  );
}

export default function BehandlungsspektrumPage() {
  return (
    <main>
      <Suspense fallback={null}>
        <BehandlungsspektrumBody />
      </Suspense>
    </main>
  );
}
