import { Suspense } from "react";
import { StoryBlocks } from "@/components/story-blocks";
import { storyMetadata } from "@/lib/seo";
import { getStoryBlocks } from "@/lib/service-module";

export function generateMetadata() {
  return storyMetadata("Notfälle", "/sos", "sos");
}

async function SosBody() {
  const blocks = await getStoryBlocks("sos");

  return <StoryBlocks blocks={blocks} />;
}

export default function SosPage() {
  return (
    <main>
      <Suspense fallback={null}>
        <SosBody />
      </Suspense>
    </main>
  );
}
