import { cacheLife } from "next/cache";

export type NavItem = {
  name: string;
  href: string;
  overlay?: boolean;
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
  overlay?: unknown;
};

const fallbackDesktop: NavItem[] = [
  { name: "Startseite", href: "/" },
  { name: "Behandler & Team", href: "/" },
  { name: "Praxis", href: "/praxis" },
  { name: "Behandlungsspektrum", href: "/behandlungsspektrum" },
  { name: "Fallbeispiele", href: "/fallbeispiele" },
];

const fallbackMobile: NavItem[] = [
  { name: "Startseite", href: "/" },
  { name: "Behandler & Team", href: "/" },
  { name: "Behandlungsspektrum", href: "/behandlungsspektrum" },
  { name: "Fallbeispiele", href: "/fallbeispiele" },
  { name: "Praxis", href: "/praxis" },
  { name: "Kontakt", href: "/kontakt" },
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

  if (trimmed.startsWith("#") || /^(https?:|mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

const routedPages: Record<string, string> = {
  Fallbeispiele: "/fallbeispiele",
  Kontakt: "/kontakt",
  Datenschutz: "/datenschutz",
  Impressum: "/impressum",
  Aktuelles: "/news",
  News: "/news",
  FAQ: "/faq",
  "FAQ (Häufig gestellte Fragen)": "/faq",
  "Häufig gestellte Fragen": "/faq",
  "Erste Hilfe": "/sos",
  SOS: "/sos",
  Tipps: "/tipps",
  Karriere: "/karriere",
};

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

    const resolved = resolveNavHref(item.link);
    const href =
      name === "Behandlungsspektrum"
        ? "/behandlungsspektrum"
        : name === "Praxis"
          ? "/praxis"
          : resolved === "/" && routedPages[name]
            ? routedPages[name]
            : resolved;

    return [{ name, href, overlay: item.overlay === true }];
  });
}

function contentVersion() {
  return process.env.NODE_ENV === "production" ? "published" : "draft";
}

async function loadNavigation(token: string, region: string, version: string) {
  "use cache";
  cacheLife("seconds");

  const url = new URL(
    "/v2/cdn/stories/main-navigation",
    apiBase(region),
  );
  url.searchParams.set("version", version);
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

  return loadNavigation(token, process.env.STORYBLOK_REGION || "eu", contentVersion());
}
