import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PostDetail } from "@/components/post-detail";
import { PostList } from "@/components/post-list";
import { SiteEnd } from "@/components/site-end";
import { getPost, getRelatedPosts } from "@/lib/posts";
import { firstRichText, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return pageMetadata("News", "/news");
  }

  return pageMetadata(post.headline || "News", `/news/${post.slug}`, firstRichText(post.body));
}

async function PostBody({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const related = await getRelatedPosts(slug);

  return (
    <>
      <PostDetail post={post} />
      <PostList posts={related} heading="Neueste Beiträge" />
      <SiteEnd />
    </>
  );
}

export default function NewsPostPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <main>
      <Suspense fallback={null}>
        <PostBody params={params} />
      </Suspense>
    </main>
  );
}
