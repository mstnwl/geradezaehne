import { cacheLife } from "next/cache";

export type NavItem = {
  name: string;
  href: string;
};

type StoryblokLink = {
  linktype?: string;
  url?: string;
  cached_url?: string;
};

type StoryblokNavItem = {
  component?: string;
  name?: string;
  link?: StoryblokLink;
};

const fallbackDesktop: NavItem[] = [
  { name: "Startseite", href: "/" },
  { name: "Behandler & Team", href: "/" },
  { name: "Praxis", href: "/" },
  { name: "Behandlungsspektrum", href: "/behandlungsspektrum" },
  { name: "Fallbeispiele", href: "/" },
];

const fallbackMobile: NavItem[] = [
  { name: "Startseite", href: "/" },
  { name: "Behandler & Team", href: "/" },
  { name: "Behandlungsspektrum", href: "/behandlungsspektrum" },
  { name: "Fallbeispiele", href: "/" },
  { name: "Praxis", href: "/" },
  { name: "Kontakt", href: "/" },
];

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

function resolveNavHref(link: StoryblokLink | undefined) {
  const value =
    link?.linktype === "url"
      ? link.url || link.cached_url || ""
      : link?.cached_url || link?.url || "";
  const trimmed = value.trim();

  if (!trimmed || trimmed === "home") {
    return "/";
  }

  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

const fallbackNavigation = {
  desktop: fallbackDesktop,
  mobile: fallbackMobile,
};

function mapItems(items: StoryblokNavItem[] | undefined) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.flatMap((item) => {
    const name = item.name?.trim();

    if (item.component !== "nav_item" || !name) {
      return [];
    }

    const href =
      name === "Behandlungsspektrum" ? "/behandlungsspektrum" : resolveNavHref(item.link);

    return [{ name, href }];
  });
}

async function loadNavigation(token: string, region: string) {
  "use cache";
  cacheLife("seconds");

  const url = new URL(
    "/v2/cdn/stories/main-navigation",
    apiBase(region),
  );
  url.searchParams.set("version", "draft");
  url.searchParams.set("token", token);

  const response = await fetch(url);

  if (!response.ok) {
    return fallbackNavigation;
  }

  const data = (await response.json()) as {
    story?: {
      content?: { desktop?: StoryblokNavItem[]; mobile?: StoryblokNavItem[] };
    };
  };
  const desktop = mapItems(data.story?.content?.desktop);
  const mobile = mapItems(data.story?.content?.mobile);

  return {
    desktop: desktop.length > 0 ? desktop : fallbackDesktop,
    mobile: mobile.length > 0 ? mobile : fallbackMobile,
  };
}

export async function getMainNavigation() {
  const token = process.env.STORYBLOK_TOKEN;

  if (!token) {
    return fallbackNavigation;
  }

  return loadNavigation(token, process.env.STORYBLOK_REGION || "eu");
}
