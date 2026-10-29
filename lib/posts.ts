import { richTextValue, type RichTextDoc } from "@/lib/rich-text";

export const postFolder = "news";

export type PostImage = {
  src: string;
  alt: string;
};

export type PostLink = {
  label: string;
  href: string;
};

export type PostSummary = {
  slug: string;
  headline: string;
  dateLabel: string;
  dateTime: string;
  image: PostImage | null;
};

export type Post = PostSummary & {
  body: RichTextDoc;
  links: PostLink[];
};

type StoryblokLink = {
  linktype?: string;
  url?: string;
  cached_url?: string;
  email?: string;
  anchor?: string;
};

type StoryblokRecord = Record<string, unknown>;

type StoryResponse = {
  story?: {
    slug?: string;
    full_slug?: string;
    content?: StoryblokRecord;
  };
};

type StoriesResponse = {
  stories?: StoryResponse["story"][];
};

function apiBase(region: string) {
  switch (region) {
    case "us":
      return "https://api-us.storyblok.com";
    case "ap":
      return "https://api-ap.storyblok.com";
    case "ca":
      return "https://api-ca.storyblok.com";
    default:
      return "https://api.storyblok.com";
  }
}

function asRecord(value: unknown): StoryblokRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as StoryblokRecord;
}

function trimmed(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function imageValue(value: unknown): PostImage | null {
  if (typeof value === "string" && /^https?:\/\//i.test(value)) {
    return { src: value, alt: "" };
  }

  const asset = asRecord(value);
  const src = asset?.filename;

  if (typeof src !== "string" || !/^https?:\/\//i.test(src)) {
    return null;
  }

  const alt = typeof asset?.alt === "string" ? asset.alt.trim() : "";

  return { src, alt };
}

function resolveHref(link: StoryblokLink | null) {
  if (!link) {
    return "";
  }

  if (link.linktype === "email") {
    const email = trimmed(link.email || link.url || link.cached_url).replace(/^mailto:/i, "");

    return email ? `mailto:${email}` : "";
  }

  const value =
    link.linktype === "url" ? link.url || link.cached_url || "" : link.cached_url || link.url || "";
  let href = value.trim();

  if (!href) {
    return "";
  }

  if (href === "home") {
    href = "/";
  } else if (!(href.startsWith("#") || /^(https?:|mailto:|tel:)/i.test(href) || href.startsWith("/"))) {
    href = `/${href}`;
  }

  const anchor = trimmed(link.anchor).replace(/^#/, "");

  if (anchor) {
    href = `${href.replace(/#.*$/, "")}#${anchor}`;
  }

  return href;
}

function postDate(value: unknown) {
  const raw = trimmed(value);
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (!match) {
    return { dateLabel: raw, dateTime: "", sort: Number.NEGATIVE_INFINITY };
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const stamp = Date.UTC(year, month - 1, day);

  return {
    dateLabel: new Intl.DateTimeFormat("de-DE", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(stamp)),
    dateTime: `${match[1]}-${match[2]}-${match[3]}`,
    sort: stamp,
  };
}

function mapSummary(story: NonNullable<StoryResponse["story"]>): (PostSummary & { sort: number }) | null {
  const content = story.content;

  if (!content || content.component !== "post") {
    return null;
  }

  const slug = trimmed(story.slug);
  const fullSlug = trimmed(story.full_slug);

  if (!slug || fullSlug !== `${postFolder}/${slug}`) {
    return null;
  }

  const date = postDate(content.date);

  return {
    slug,
    headline: trimmed(content.headline),
    dateLabel: date.dateLabel,
    dateTime: date.dateTime,
    image: imageValue(content.image),
    sort: date.sort,
  };
}

function mapPostLink(value: unknown): PostLink | null {
  const record = asRecord(value);

  if (!record || record.component !== "post_link") {
    return null;
  }

  const label = trimmed(record.label);
  const href = resolveHref(asRecord(record.link) as StoryblokLink | null);

  if (!label || !href) {
    return null;
  }

  return { label, href };
}

function mapPost(story: NonNullable<StoryResponse["story"]>): Post | null {
  const summary = mapSummary(story);

  if (!summary || !story.content) {
    return null;
  }

  const links = Array.isArray(story.content.links)
    ? story.content.links.flatMap((item) => {
        const mapped = mapPostLink(item);

        return mapped ? [mapped] : [];
      })
    : [];

  return {
    slug: summary.slug,
    headline: summary.headline,
    dateLabel: summary.dateLabel,
    dateTime: summary.dateTime,
    image: summary.image,
    body: richTextValue(story.content.body),
    links,
  };
}

async function readStories(token: string, region: string) {
  const stories: NonNullable<StoryResponse["story"]>[] = [];
  let page = 1;

  while (page < 20) {
    const url = new URL("/v2/cdn/stories", apiBase(region));
    url.searchParams.set("version", "published");
    url.searchParams.set("starts_with", `${postFolder}/`);
    url.searchParams.set("content_type", "post");
    url.searchParams.set("per_page", "100");
    url.searchParams.set("page", String(page));
    url.searchParams.set("token", token);

    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      break;
    }

    const data = (await response.json()) as StoriesResponse;
    const batch = (data.stories ?? []).filter((story): story is NonNullable<StoryResponse["story"]> => Boolean(story));

    stories.push(...batch);

    if (batch.length < 100) {
      break;
    }

    page += 1;
  }

  return stories;
}

export async function getPublishedPosts() {
  const token = process.env.STORYBLOK_TOKEN;

  if (!token) {
    return [];
  }

  try {
    const stories = await readStories(token, process.env.STORYBLOK_REGION || "eu");

    return stories
      .flatMap((story) => {
        const mapped = mapSummary(story);

        return mapped ? [mapped] : [];
      })
      .sort((a, b) => b.sort - a.sort)
      .map((post) => ({
        slug: post.slug,
        headline: post.headline,
        dateLabel: post.dateLabel,
        dateTime: post.dateTime,
        image: post.image,
      }));
  } catch {
    return [];
  }
}

export async function getPost(slug: string) {
  const token = process.env.STORYBLOK_TOKEN;
  const safeSlug = slug.trim();

  if (!token || !safeSlug || safeSlug.includes("/")) {
    return null;
  }

  try {
    const url = new URL(`/v2/cdn/stories/${postFolder}/${encodeURIComponent(safeSlug)}`, apiBase(process.env.STORYBLOK_REGION || "eu"));
    url.searchParams.set("version", "published");
    url.searchParams.set("token", token);

    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as StoryResponse;

    return data.story ? mapPost(data.story) : null;
  } catch {
    return null;
  }
}

export async function getRelatedPosts(slug: string) {
  const posts = await getPublishedPosts();

  return posts.filter((post) => post.slug !== slug).slice(0, 3);
}
