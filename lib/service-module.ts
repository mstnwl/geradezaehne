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

export type AgeGroup = {
  headline: string;
  image: ServiceImage | null;
  paragraphs: string[];
  treatmentsLabel: string;
  treatments: ServiceLink[];
};

export type AgeGroupsContent = {
  id: string;
  groups: AgeGroup[];
};

export type ImageTeaserContent = {
  id: string;
  eyebrow: string;
  headline: string;
  text: string;
  linkLabel: string;
  href: string;
  image: ServiceImage | null;
  overlay: number;
};

export type HeroContent = {
  id: string;
  headline: string;
  copy: string;
  buttonLabel: string;
  buttonHref: string;
  image: ServiceImage | null;
};

export type HomeBlock =
  | { kind: "hero"; hero: HeroContent }
  | { kind: "service"; service: ServiceModuleContent }
  | { kind: "quote"; quote: QuoteContent }
  | { kind: "age-groups"; ageGroups: AgeGroupsContent }
  | { kind: "image-teaser"; teaser: ImageTeaserContent };

const fallbackHero: HeroContent = {
  id: "fallback-hero",
  headline: "Gerade Zähne. Natürlich schön.",
  copy: "Als Fachzahnärzte für Kieferorthopädie begleiten wir Sie mit Erfahrung, Empathie und neuesten Behandlungsmethoden – von der ersten Beratung bis zum perfekten Lächeln.",
  buttonLabel: "Termin buchen",
  buttonHref: "#",
  image: null,
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

const fallbackQuote: QuoteContent = {
  id: "fallback-quote",
  quote:
    "„Wir begleiten unsere Patienten seit über vierzig Jahren mit Erfahrung, Herz und neuester Technik.“",
  name: "Dr. Günter Hück",
};

const fallbackImageTeaser: ImageTeaserContent = {
  id: "fallback-image-teaser",
  eyebrow: "Praxis",
  headline: "Ein Blick in unsere Praxis",
  text: "Werfen Sie einen Blick in unsere Praxisräume und gewinnen Sie ein Gefühl für die Atmosphäre, die uns ausmacht.",
  linkLabel: "Mehr zur Praxis",
  href: "/",
  image: null,
  overlay: 40,
};

const fallbackAgeGroups: AgeGroupsContent = {
  id: "fallback-age-groups",
  groups: [
    {
      headline: "Kinder",
      image: null,
      paragraphs: [
        "Ein gesunder Start für kleine Zähne. Wir begleiten Kinder behutsam beim Wachstum von Kiefer und Zähnen – mit Geduld, altersgerechter Sprache und sanften Methoden. So bleibt der Besuch beim Kieferorthopäden ein positives Erlebnis.",
        "Die erste kieferorthopädische Kontrolle empfehlen wir etwa ab dem 6.–7. Lebensjahr. In diesem Alter können mögliche Zahn- und Kieferfehlstellungen frühzeitig erkannt und bei Bedarf sanft begleitet werden.",
      ],
      treatmentsLabel: "Typische Behandlungen:",
      treatments: [
        { name: "Frühbehandlung", href: "/" },
        { name: "Platzhalter", href: "/" },
        { name: "Herausnehmbare Zahnspangen", href: "/" },
      ],
    },
    {
      headline: "Jugendliche",
      image: null,
      paragraphs: [
        "Während der Wachstumsphase lassen sich Zahnfehlstellungen besonders gut korrigieren. Ob feste Zahnspange oder nahezu unsichtbare Aligner – gemeinsam finden wir eine Lösung, die optimal zu deinem Alltag und Lebensstil passt.",
      ],
      treatmentsLabel: "Typische Behandlungen:",
      treatments: [
        { name: "Feste Zahnspangen", href: "/" },
        { name: "Aligner (z. B. Invisalign Teen)", href: "/" },
        { name: "Retainer", href: "/" },
      ],
    },
    {
      headline: "Erwachsene",
      image: null,
      paragraphs: [
        "Zahnkorrekturen sind in jedem Alter möglich – sanft, effizient und oft nahezu unsichtbar. Ob mit Alignern, lingualen Apparaturen oder digital geplanten Schienen: Wir korrigieren Ihr Lächeln unauffällig und ästhetisch, ohne Einschränkungen im Alltag.",
      ],
      treatmentsLabel: "Typische Behandlungen:",
      treatments: [
        { name: "Aligner", href: "/" },
        { name: "Lingualtechnik", href: "/" },
        { name: "CMD-Therapie", href: "/" },
        { name: "Anti-Schnarchschiene", href: "/" },
      ],
    },
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

function homeBlocksInBody(content: StoryblokRecord): StoryblokRecord[] {
  if (!Array.isArray(content.body)) {
    return [];
  }

  return content.body.flatMap((item) => {
    const record = asRecord(item);

    if (
      !record ||
      (record.component !== "hero" &&
        record.component !== "service_module" &&
        record.component !== "quote" &&
        record.component !== "age_groups" &&
        record.component !== "image_teaser")
    ) {
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

function mapHero(module: StoryblokRecord, index: number): HeroContent {
  const link = asRecord(module.button_link) as StoryblokLink | null;

  return {
    id: blockId(module, index, "hero"),
    headline: textValue(module.headline, fallbackHero.headline),
    copy: textValue(module.copy, fallbackHero.copy),
    buttonLabel: textValue(module.button_label, fallbackHero.buttonLabel),
    buttonHref: module.button_link ? resolveHref(link ?? undefined) : fallbackHero.buttonHref,
    image: imageValue(module.image),
  };
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

function paragraphsValue(value: unknown): string[] {
  if (typeof value === "string") {
    return value
      .split(/\n+/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  }

  const doc = asRecord(value);

  if (!doc || !Array.isArray(doc.content)) {
    return [];
  }

  return doc.content.flatMap((node) => {
    const paragraph = plainText(node).trim();

    return paragraph ? [paragraph] : [];
  });
}

function plainText(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  const record = asRecord(value);

  if (!record) {
    return "";
  }

  if (typeof record.text === "string") {
    return record.text;
  }

  if (!Array.isArray(record.content)) {
    return "";
  }

  return record.content.map((node) => plainText(node)).join("");
}

function treatmentLinks(value: unknown): ServiceLink[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    const record = asRecord(item);

    if (!record || record.component !== "age_group_link" || typeof record.name !== "string") {
      return [];
    }

    const name = record.name.trim();

    if (!name) {
      return [];
    }

    const link = asRecord(record.link) as StoryblokLink | null;

    return [{ name, href: resolveHref(link ?? undefined) }];
  });
}

function mapAgeGroup(value: unknown): AgeGroup | null {
  const record = asRecord(value);

  if (!record || record.component !== "age_group") {
    return null;
  }

  return {
    headline: textValue(record.headline, ""),
    image: imageValue(record.image),
    paragraphs: paragraphsValue(record.text),
    treatmentsLabel: typeof record.treatments_label === "string" ? record.treatments_label.trim() : "",
    treatments: treatmentLinks(record.treatments),
  };
}

function mapAgeGroups(module: StoryblokRecord, index: number): AgeGroupsContent {
  const groups = Array.isArray(module.groups)
    ? module.groups.flatMap((group) => {
        const mapped = mapAgeGroup(group);

        return mapped ? [mapped] : [];
      })
    : [];

  return {
    id: blockId(module, index, "age-groups"),
    groups: groups.length > 0 ? groups : fallbackAgeGroups.groups,
  };
}

function overlayValue(value: unknown) {
  const number =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim() !== ""
        ? Number(value)
        : Number.NaN;

  if (!Number.isFinite(number)) {
    return fallbackImageTeaser.overlay;
  }

  return Math.min(100, Math.max(0, number));
}

function mapImageTeaser(module: StoryblokRecord, index: number): ImageTeaserContent {
  const link = asRecord(module.link) as StoryblokLink | null;

  return {
    id: blockId(module, index, "image-teaser"),
    eyebrow: textValue(module.eyebrow, fallbackImageTeaser.eyebrow),
    headline: textValue(module.headline, fallbackImageTeaser.headline),
    text: textValue(module.text, fallbackImageTeaser.text),
    linkLabel: textValue(module.link_label, fallbackImageTeaser.linkLabel),
    href: module.link ? resolveHref(link ?? undefined) : fallbackImageTeaser.href,
    image: imageValue(module.image),
    overlay: overlayValue(module.overlay),
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
  let hero: HeroContent | null = null;

  records.forEach((record, index) => {
    if (record.component === "hero") {
      if (!hero) {
        hero = mapHero(record, index);
      }
    } else if (record.component === "service_module") {
      blocks.push({ kind: "service", service: mapModule(record, index) });
    } else if (record.component === "quote") {
      blocks.push({ kind: "quote", quote: mapQuote(record, index) });
    } else if (record.component === "age_groups") {
      blocks.push({ kind: "age-groups", ageGroups: mapAgeGroups(record, index) });
    } else if (record.component === "image_teaser") {
      blocks.push({ kind: "image-teaser", teaser: mapImageTeaser(record, index) });
    }
  });

  if (!blocks.some((block) => block.kind === "service")) {
    blocks.unshift({ kind: "service", service: fallbackServiceModule });
  }

  if (!blocks.some((block) => block.kind === "quote")) {
    blocks.push({ kind: "quote", quote: fallbackQuote });
  }

  if (!blocks.some((block) => block.kind === "age-groups")) {
    blocks.push({ kind: "age-groups", ageGroups: fallbackAgeGroups });
  }

  if (!blocks.some((block) => block.kind === "image-teaser")) {
    blocks.push({ kind: "image-teaser", teaser: fallbackImageTeaser });
  }

  return [{ kind: "hero", hero: hero ?? fallbackHero }, ...blocks];
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
  { kind: "hero", hero: fallbackHero },
  { kind: "service", service: fallbackServiceModule },
  { kind: "quote", quote: fallbackQuote },
  { kind: "age-groups", ageGroups: fallbackAgeGroups },
  { kind: "image-teaser", teaser: fallbackImageTeaser },
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
