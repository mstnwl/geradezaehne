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

export type QuoteContent = {
  id: string;
  quote: string;
  name: string;
};

export type HomeBlock =
  | { kind: "service"; service: ServiceModuleContent }
  | { kind: "quote"; quote: QuoteContent };

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

const fallbackQuote: QuoteContent = {
  id: "fallback-quote",
  quote:
    "„Wir begleiten unsere Patienten seit über vierzig Jahren mit Erfahrung, Herz und neuester Technik.“",
  name: "Dr. Günter Hück",
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

function homeBlocksInBody(content: StoryblokRecord): StoryblokRecord[] {
  if (!Array.isArray(content.body)) {
    return [];
  }

  return content.body.flatMap((item) => {
    const record = asRecord(item);

    if (!record || (record.component !== "service_module" && record.component !== "quote")) {
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

function blockId(record: StoryblokRecord, index: number, prefix: string) {
  const uid = typeof record._uid === "string" ? record._uid.trim() : "";

  return uid || `${prefix}-${index}`;
}

function mapModule(module: StoryblokRecord, index: number): ServiceModuleContent {
  return {
    id: blockId(module, index, "service"),
    eyebrow: textValue(module.eyebrow, fallbackServiceModule.eyebrow),
    headline: textValue(module.headline, fallbackServiceModule.headline),
    text: textValue(module.text, fallbackServiceModule.text),
    image: imageValue(module.image),
    links: linkValue(module.links),
  };
}

function mapQuote(module: StoryblokRecord, index: number): QuoteContent {
  return {
    id: blockId(module, index, "quote"),
    quote: textValue(module.quote, fallbackQuote.quote),
    name: textValue(module.name, fallbackQuote.name),
  };
}

function toHomeBlocks(records: StoryblokRecord[]): HomeBlock[] {
  const blocks: HomeBlock[] = [];

  records.forEach((record, index) => {
    if (record.component === "service_module") {
      blocks.push({ kind: "service", service: mapModule(record, index) });
    } else if (record.component === "quote") {
      blocks.push({ kind: "quote", quote: mapQuote(record, index) });
    }
  });

  if (!blocks.some((block) => block.kind === "service")) {
    blocks.unshift({ kind: "service", service: fallbackServiceModule });
  }

  if (!blocks.some((block) => block.kind === "quote")) {
    blocks.push({ kind: "quote", quote: fallbackQuote });
  }

  return blocks;
}

async function readHomeBlocks(token: string, region: string, version: string) {
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

  const blocks = homeBlocksInBody(content);

  return blocks.length > 0 ? blocks : null;
}

const fallbackHomeBlocks: HomeBlock[] = [
  { kind: "service", service: fallbackServiceModule },
  { kind: "quote", quote: fallbackQuote },
];

async function loadHomeBlocks(token: string, region: string) {
  try {
    const published = await readHomeBlocks(token, region, "published");

    if (published) {
      return toHomeBlocks(published);
    }

    const draft = await readHomeBlocks(token, region, "draft");

    if (draft) {
      return toHomeBlocks(draft);
    }
  } catch {
    return fallbackHomeBlocks;
  }

  return fallbackHomeBlocks;
}

export async function getHomeBlocks() {
  const token = process.env.STORYBLOK_TOKEN;

  if (!token) {
    return fallbackHomeBlocks;
  }

  return loadHomeBlocks(token, process.env.STORYBLOK_REGION || "eu");
}
