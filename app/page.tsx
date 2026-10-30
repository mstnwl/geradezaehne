import { Suspense } from "react";
import { StoryBlocks } from "@/components/story-blocks";
import { storyMetadata } from "@/lib/seo";
import { getHomeBlocks } from "@/lib/service-module";

export function generateMetadata() {
  return storyMetadata("Startseite", "/");
}

async function HomeBody() {
  const blocks = await getHomeBlocks();

  return <StoryBlocks blocks={blocks} />;
}

export default function Home() {
  return (
    <main>
      <Suspense fallback={null}>
        <HomeBody />
      </Suspense>
    </main>
  );
}
