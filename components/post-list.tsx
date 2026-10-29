import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import type { PostSummary } from "@/lib/posts";

function PostThumb({ post }: { post: PostSummary }) {
  const frame = post.image ? (
    <div className="relative size-40 overflow-hidden bg-background lg:size-72">
      <Image src={post.image.src} alt="" fill sizes="(min-width: 64rem) 18rem, 10rem" className="object-cover" />
    </div>
  ) : (
    <div className="size-40 bg-background lg:size-72" aria-hidden="true" />
  );

  return (
    <Link href={`/news/${post.slug}`} aria-label={post.headline || "Lesen"} className="shrink-0">
      {frame}
    </Link>
  );
}

function PostDate({ post }: { post: PostSummary }) {
  if (!post.dateLabel) {
    return null;
  }

  if (!post.dateTime) {
    return <p className="text-base leading-normal font-normal text-ink lg:text-[18px]">{post.dateLabel}</p>;
  }

  return (
    <time dateTime={post.dateTime} className="text-base leading-normal font-normal text-ink lg:text-[18px]">
      {post.dateLabel}
    </time>
  );
}

export function PostRow({ post }: { post: PostSummary }) {
  return (
    <li className="flex items-start gap-gutter">
      <PostThumb post={post} />
      <div className="flex flex-col gap-pair">
        <PostDate post={post} />
        {post.headline ? <h4 className="text-ink">{post.headline}</h4> : null}
        <Link href={`/news/${post.slug}`} className="header-link inline-flex w-fit items-center gap-pair text-nav">
          <span className="menu-arrow size-icon shrink-0" aria-hidden="true" />
          Lesen
        </Link>
      </div>
    </li>
  );
}

export function PostList({ posts, heading }: { posts: PostSummary[]; heading?: string }) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <Reveal className="bg-white px-gutter py-20">
      <div className="mx-auto flex max-w-column flex-col gap-nav">
        {heading ? <h2 className="text-ink">{heading}</h2> : null}
        <ul className="flex flex-col gap-nav">
          {posts.map((post) => (
            <PostRow key={post.slug} post={post} />
          ))}
        </ul>
      </div>
    </Reveal>
  );
}
