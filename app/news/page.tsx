import { Suspense } from "react";
import { PostList } from "@/components/post-list";
import { StoryBlocks } from "@/components/story-blocks";
import { getPublishedPosts } from "@/lib/posts";
import { getStoryBlocks } from "@/lib/service-module";

async function NewsBody() {
  const [blocks, posts] = await Promise.all([getStoryBlocks("news"), getPublishedPosts()]);

  return (
    <>
      <StoryBlocks blocks={blocks} />
      <PostList posts={posts} heading="Beiträge" />
    </>
  );
}

export default function NewsPage() {
  return (
    <main>
      <Suspense fallback={null}>
        <NewsBody />
      </Suspense>
    </main>
  );
}
