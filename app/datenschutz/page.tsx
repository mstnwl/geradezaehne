import { Suspense } from "react";
import { StoryBlocks } from "@/components/story-blocks";
import { storyMetadata } from "@/lib/seo";
import { getStoryBlocks } from "@/lib/service-module";

export function generateMetadata() {
  return storyMetadata("Datenschutz", "/datenschutz", "datenschutz");
}

async function DatenschutzBody() {
  const blocks = await getStoryBlocks("datenschutz");

  return <StoryBlocks blocks={blocks} />;
}

export default function DatenschutzPage() {
  return (
    <main>
      <Suspense fallback={null}>
        <DatenschutzBody />
      </Suspense>
    </main>
  );
}
