export type ServiceLink = {
  name: string;
  href: string;
};

export type ServiceImage = {
  src: string;
  alt: string;
};

export type ServiceModuleContent = {
  id: string;
  eyebrow: string;
  headline: string;
  text: string;
  image: ServiceImage | null;
  links: ServiceLink[];
};

const fallbackServiceModule: ServiceModuleContent = {
  id: "fallback",
  eyebrow: "SERVICE",
  headline: "Wissenswertes für unsere Patienten",
  text: "Wir haben die wichtigsten Informationen rund um Ihre Behandlung, Pflege und den Praxisalltag für Sie zusammengestellt.",
  image: null,
  links: [
    { name: "Notfälle & Erste Hilfe bei Zahnspangen", href: "/" },
    { name: "Pflege & Tipps für zuhause", href: "/" },
    { name: "Häufig gestellte Fragen", href: "/" },
    { name: "News", href: "/" },
  ],
};

type StoryblokLink = {
  linktype?: string;
  url?: string;
  cached_url?: string;
};

type StoryblokRecord = Record<string, unknown>;

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

function resolveHref(link: StoryblokLink | undefined) {
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

function asRecord(value: unknown): StoryblokRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as StoryblokRecord;
}

function serviceModulesInBody(content: StoryblokRecord): StoryblokRecord[] {
  if (!Array.isArray(content.body)) {
    return [];
  }

  return content.body.flatMap((item) => {
    const record = asRecord(item);

    if (!record || record.component !== "service_module") {
      return [];
    }

    return [record];
  });
}

function textValue(value: unknown, fallback: string) {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();

  return trimmed || fallback;
}

function imageValue(value: unknown): ServiceImage | null {
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

function linkValue(value: unknown): ServiceLink[] {
  if (!Array.isArray(value)) {
    return fallbackServiceModule.links;
  }

  const links = value.flatMap((item) => {
    const record = asRecord(item);

    if (!record || record.component !== "service_link" || typeof record.name !== "string") {
      return [];
    }

    const name = record.name.trim();

    if (!name) {
      return [];
    }

    const link = asRecord(record.link) as StoryblokLink | null;

    return [{ name, href: resolveHref(link ?? undefined) }];
  });

  return links.length > 0 ? links : fallbackServiceModule.links;
}

function mapModule(module: StoryblokRecord, index: number): ServiceModuleContent {
  const uid = typeof module._uid === "string" ? module._uid.trim() : "";

  return {
    id: uid || `service-${index}`,
    eyebrow: textValue(module.eyebrow, fallbackServiceModule.eyebrow),
    headline: textValue(module.headline, fallbackServiceModule.headline),
    text: textValue(module.text, fallbackServiceModule.text),
    image: imageValue(module.image),
    links: linkValue(module.links),
  };
}

async function readServiceModules(token: string, region: string, version: string) {
  const url = new URL("/v2/cdn/stories/home", apiBase(region));
  url.searchParams.set("version", version);
  url.searchParams.set("token", token);

  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as {
    story?: { content?: StoryblokRecord };
  };
  const content = data.story?.content;

  if (!content) {
    return null;
  }

  const modules = serviceModulesInBody(content);

  return modules.length > 0 ? modules : null;
}

async function loadServiceModules(token: string, region: string) {
  try {
    const published = await readServiceModules(token, region, "published");

    if (published) {
      return published.map(mapModule);
    }

    const draft = await readServiceModules(token, region, "draft");

    if (draft) {
      return draft.map(mapModule);
    }
  } catch {
    return [fallbackServiceModule];
  }

  return [fallbackServiceModule];
}

export async function getServiceModules() {
  const token = process.env.STORYBLOK_TOKEN;

  if (!token) {
    return [fallbackServiceModule];
  }

  return loadServiceModules(token, process.env.STORYBLOK_REGION || "eu");
}
