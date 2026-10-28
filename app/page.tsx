import { Suspense } from "react";
import { StoryBlocks } from "@/components/story-blocks";
import { getHomeBlocks } from "@/lib/service-module";

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
