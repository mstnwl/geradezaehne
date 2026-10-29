import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import type { HomeBlock } from "@/lib/service-module";
import type { PostSummary } from "@/lib/posts";

function pageHasTitle(blocks: HomeBlock[]) {
  return blocks.some((block) => {
    switch (block.kind) {
      case "hero":
        return block.hero.headline.length > 0;
      case "content-hero":
        return block.contentHero.headline.length > 0;
      case "content-service":
        return block.contentService.headline.length > 0;
      case "service":
        return block.service.headline.length > 0;
      case "image-teaser":
        return block.teaser.headline.length > 0;
      case "info-panel":
        return block.info.headline.length > 0;
      case "booking":
        return block.booking.headline.length > 0;
      case "team-grid":
        return block.teamGrid.headline.length > 0;
      case "gallery":
        return block.gallery.headline.length > 0;
      case "case-study":
        return block.caseStudy.headline.length > 0;
      case "faq":
        return block.faq.headline.length > 0;
      case "age-groups":
        return block.ageGroups.groups.some((group) => group.headline.length > 0);
      default:
        return false;
    }
  });
}

export function newsListHeading(blocks: HomeBlock[]) {
  return pageHasTitle(blocks) ? undefined : "Beiträge";
}

function PostThumb({ post }: { post: PostSummary }) {
  if (!post.image) {
    return <div className="size-32 shrink-0 bg-background" aria-hidden="true" />;
  }

  return (
    <div className="relative size-32 shrink-0 overflow-hidden bg-background">
      <Image src={post.image.src} alt="" fill sizes="128px" className="object-cover" />
    </div>
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
    <li>
      <Link href={`/news/${post.slug}`} className="group flex items-start gap-gutter">
        <PostThumb post={post} />
        <span className="flex flex-col gap-pair">
          <PostDate post={post} />
          {post.headline ? (
            <span className="text-base leading-normal font-medium text-ink transition-[color,transform] duration-150 ease-out group-hover:-translate-y-px group-hover:text-accent lg:text-[18px]">
              {post.headline}
            </span>
          ) : null}
        </span>
      </Link>
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
