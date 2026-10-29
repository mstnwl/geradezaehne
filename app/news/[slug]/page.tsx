import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PostDetail } from "@/components/post-detail";
import { PostList } from "@/components/post-list";
import { getPost, getRelatedPosts } from "@/lib/posts";

async function PostBody({ slug }: { slug: string }) {
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const related = await getRelatedPosts(slug);

  return (
    <>
      <PostDetail post={post} />
      <PostList posts={related} heading="Neueste Beiträge" />
    </>
  );
}

export default async function NewsPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <main>
      <Suspense fallback={null}>
        <PostBody slug={slug} />
      </Suspense>
    </main>
  );
}
