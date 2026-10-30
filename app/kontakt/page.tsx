import { Suspense } from "react";
import { SiteEnd } from "@/components/site-end";
import { StoryBlocks } from "@/components/story-blocks";
import { storyMetadata } from "@/lib/seo";
import { getStoryBlocks } from "@/lib/service-module";

export function generateMetadata() {
  return storyMetadata("Kontakt", "/kontakt", "kontakt");
}

async function KontaktBody() {
  const blocks = await getStoryBlocks("kontakt");

  return (
    <>
      <StoryBlocks blocks={blocks} />
      <SiteEnd />
    </>
  );
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
