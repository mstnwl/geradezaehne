import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { RichText } from "@/components/rich-text";
import type { Post, PostImage, PostLink } from "@/lib/posts";

function imageSize(src: string) {
  const match = src.match(/\/(\d+)x(\d+)\//);

  if (!match) {
    return null;
  }

  return { width: Number(match[1]), height: Number(match[2]) };
}

function PostPicture({ image }: { image: PostImage }) {
  const size = imageSize(image.src);

  if (!size) {
    return <img src={image.src} alt={image.alt} className="h-auto w-full" />;
  }

  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={size.width}
      height={size.height}
      sizes="(min-width: 64rem) 35rem, 100vw"
      className="h-auto w-full"
    />
  );
}

function PostAnchor({ link }: { link: PostLink }) {
  const className = "header-link inline-flex items-center gap-pair text-nav";
  const content = (
    <>
      <span className="menu-arrow size-icon shrink-0" aria-hidden="true" />
      {link.label}
    </>
  );

  if (/^(https?:|mailto:|tel:|#)/i.test(link.href)) {
    return (
      <a href={link.href} className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {content}
    </Link>
  );
}

function PostDate({ post }: { post: Post }) {
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

export function PostDetail({ post }: { post: Post }) {
  return (
    <Reveal className="bg-white px-gutter py-20">
      <div className="mx-auto grid max-w-column items-start gap-nav lg:grid-cols-2 lg:gap-x-20">
        <div className="flex flex-col gap-nav">
          {post.dateLabel || post.headline ? (
            <div className="flex flex-col gap-pair">
              <PostDate post={post} />
              {post.headline ? <h1 className="text-ink">{post.headline}</h1> : null}
            </div>
          ) : null}
          {post.image ? (
            <div className="lg:hidden">
              <PostPicture image={post.image} />
            </div>
          ) : null}
          {post.body.blocks.length > 0 ? <RichText document={post.body} /> : null}
          {post.links.length > 0 ? (
            <ul className="flex flex-col gap-pair">
              {post.links.map((link, index) => (
                <li key={`${link.href}-${index}`}>
                  <PostAnchor link={link} />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {post.image ? (
          <div className="hidden lg:block">
            <PostPicture image={post.image} />
          </div>
        ) : null}
      </div>
    </Reveal>
  );
}
