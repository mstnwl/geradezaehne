import { richTextValue, type RichTextDoc } from "@/lib/rich-text";

export type ServiceLink = {
  name: string;
  href: string;
  overlay?: boolean;
};

export type ServiceImage = {
  src: string;
  alt: string;
};

export type ServiceModuleContent = {
  id: string;
  anchor: string;
  eyebrow: string;
  headline: string;
  text: string;
  richText: RichTextDoc | null;
  image: ServiceImage | null;
  links: ServiceLink[];
  portrait: boolean;
};

export type QuoteContent = {
  id: string;
  anchor: string;
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
  anchor: string;
  groups: AgeGroup[];
};

export type ImageTeaserContent = {
  id: string;
  anchor: string;
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
  anchor: string;
  headline: string;
  copy: string;
  buttonLabel: string;
  buttonHref: string;
  overlay: boolean;
  image: ServiceImage | null;
};

export type TrustBandContent = {
  id: string;
  anchor: string;
  stars: number;
  items: string[];
};

export type InfoPanelContent = {
  id: string;
  anchor: string;
  eyebrow: string;
  headline: string;
  body: string;
  links: ServiceLink[];
};

export type BookingContent = {
  id: string;
  anchor: string;
  headline: string;
  body: string;
  bookingLabel: string;
  bookingHref: string;
  overlay: boolean;
  phoneLabel: string;
  phoneHref: string;
};

export type TeamMember = {
  name: string;
  role: string;
  image: ServiceImage | null;
};

export type TeamGridContent = {
  id: string;
  anchor: string;
  headline: string;
  members: TeamMember[];
};

export type GalleryImage = {
  image: ServiceImage | null;
  caption: string;
};

export type GalleryContent = {
  id: string;
  anchor: string;
  headline: string;
  body: string;
  images: GalleryImage[];
};

export type CasePhoto = {
  image: ServiceImage | null;
  caption: string;
};

export type CaseStudyContent = {
  id: string;
  anchor: string;
  eyebrow: string;
  headline: string;
  situationLabel: string;
  situation: string;
  treatmentLabel: string;
  treatment: string;
  resultLabel: string;
  result: string;
  photos: CasePhoto[];
};

export type FaqItem = {
  question: string;
  answer: RichTextDoc;
  anchor: string;
};

export type FaqContent = {
  id: string;
  anchor: string;
  headline: string;
  body: string;
  items: FaqItem[];
};

export type ContentHeroContent = {
  id: string;
  anchor: string;
  eyebrow: string;
  headline: string;
  image: ServiceImage | null;
  body: RichTextDoc;
  links: ServiceLink[];
};

export type HomeBlock =
  | { kind: "hero"; hero: HeroContent }
  | { kind: "trust-band"; trust: TrustBandContent }
  | { kind: "content-hero"; contentHero: ContentHeroContent }
  | { kind: "content-service"; contentService: ServiceModuleContent }
  | { kind: "service"; service: ServiceModuleContent }
  | { kind: "quote"; quote: QuoteContent }
  | { kind: "age-groups"; ageGroups: AgeGroupsContent }
  | { kind: "image-teaser"; teaser: ImageTeaserContent }
  | { kind: "info-panel"; info: InfoPanelContent }
  | { kind: "booking"; booking: BookingContent }
  | { kind: "team-grid"; teamGrid: TeamGridContent }
  | { kind: "gallery"; gallery: GalleryContent }
  | { kind: "case-study"; caseStudy: CaseStudyContent }
  | { kind: "faq"; faq: FaqContent };

const fallbackHero: HeroContent = {
  id: "fallback-hero",
  anchor: "",
  headline: "Gerade Zähne. Natürlich schön.",
  copy: "Als Fachzahnärzte für Kieferorthopädie begleiten wir Sie mit Erfahrung, Empathie und neuesten Behandlungsmethoden – von der ersten Beratung bis zum perfekten Lächeln.",
  buttonLabel: "Termin buchen",
  buttonHref: "#",
  overlay: false,
  image: null,
};

const fallbackTrustBand: TrustBandContent = {
  id: "fallback-trust-band",
  anchor: "",
  stars: 5,
  items: [
    "Über 15.000 Behandlungen",
    "Mitglied der DGKFO, BDK, AAO, WFO",
    "Mehr als 45 Jahre Erfahrung",
  ],
};

const fallbackInfoPanel: InfoPanelContent = {
  id: "fallback-info-panel",
  anchor: "",
  eyebrow: "SERVICE",
  headline: "Wissenswertes für unsere Patienten",
  body: "Wir haben die wichtigsten Informationen rund um Ihre Behandlung, Pflege und den Praxisalltag für Sie zusammengestellt.",
  links: [
    { name: "Notfälle & Erste Hilfe bei Zahnspangen", href: "/" },
    { name: "Pflege & Tipps für zuhause", href: "/" },
    { name: "Häufig gestellte Fragen", href: "/" },
    { name: "News", href: "/" },
  ],
};

const fallbackServiceModule: ServiceModuleContent = {
  id: "fallback",
  anchor: "",
  eyebrow: "SERVICE",
  headline: "Wissenswertes für unsere Patienten",
  text: "Wir haben die wichtigsten Informationen rund um Ihre Behandlung, Pflege und den Praxisalltag für Sie zusammengestellt.",
  richText: null,
  image: null,
  links: [
    { name: "Notfälle & Erste Hilfe bei Zahnspangen", href: "/" },
    { name: "Pflege & Tipps für zuhause", href: "/" },
    { name: "Häufig gestellte Fragen", href: "/" },
    { name: "News", href: "/" },
  ],
  portrait: false,
};

const fallbackQuote: QuoteContent = {
  id: "fallback-quote",
  anchor: "",
  quote:
    "„Wir begleiten unsere Patienten seit über vierzig Jahren mit Erfahrung, Herz und neuester Technik.“",
  name: "Dr. Günter Hück",
};

const fallbackImageTeaser: ImageTeaserContent = {
  id: "fallback-image-teaser",
  anchor: "",
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
  anchor: "",
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

  if (trimmed.startsWith("#") || /^(https?:|mailto:|tel:)/i.test(trimmed)) {
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
        record.component !== "trust_band" &&
        record.component !== "service_module" &&
        record.component !== "content_hero" &&
        record.component !== "content_service" &&
        record.component !== "quote" &&
        record.component !== "age_groups" &&
        record.component !== "image_teaser" &&
        record.component !== "info_panel" &&
        record.component !== "booking" &&
        record.component !== "team_grid" &&
        record.component !== "gallery" &&
        record.component !== "case_study" &&
        record.component !== "faq")
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

function serviceLinks(value: unknown): ServiceLink[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    const record = asRecord(item);

    if (!record || record.component !== "service_link" || typeof record.name !== "string") {
      return [];
    }

    const name = record.name.trim();

    if (!name) {
      return [];
    }

    const link = asRecord(record.link) as StoryblokLink | null;

    return [{ name, href: resolveHref(link ?? undefined), overlay: record.overlay === true }];
  });
}

function linkValue(value: unknown): ServiceLink[] {
  const links = serviceLinks(value);

  return links.length > 0 ? links : fallbackServiceModule.links;
}

function contentLinks(value: unknown): ServiceLink[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    const record = asRecord(item);

    if (!record || record.component !== "content_link" || typeof record.label !== "string") {
      return [];
    }

    const name = record.label.trim();

    if (!name) {
      return [];
    }

    const link = asRecord(record.link) as StoryblokLink | null;

    return [{ name, href: resolveHref(link ?? undefined) }];
  });
}

function blockId(record: StoryblokRecord, index: number, prefix: string) {
  const uid = typeof record._uid === "string" ? record._uid.trim() : "";

  return uid || `${prefix}-${index}`;
}

function starsValue(value: unknown) {
  const number =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim() !== ""
        ? Number(value)
        : Number.NaN;

  if (!Number.isFinite(number) || number < 0) {
    return fallbackTrustBand.stars;
  }

  return Math.min(10, Math.floor(number));
}

function trustItems(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    const record = asRecord(item);

    if (!record || record.component !== "trust_item" || typeof record.label !== "string") {
      return [];
    }

    const label = record.label.trim();

    return label ? [label] : [];
  });
}

function mapTrustBand(module: StoryblokRecord, index: number): TrustBandContent {
  return {
    id: blockId(module, index, "trust-band"),
    anchor: anchorValue(module.anchor),
    stars: starsValue(module.stars),
    items: trustItems(module.items),
  };
}

function mapHero(module: StoryblokRecord, index: number): HeroContent {
  const link = asRecord(module.button_link) as StoryblokLink | null;

  return {
    id: blockId(module, index, "hero"),
    anchor: anchorValue(module.anchor),
    headline: textValue(module.headline, fallbackHero.headline),
    copy: textValue(module.copy, fallbackHero.copy),
    buttonLabel: textValue(module.button_label, fallbackHero.buttonLabel),
    buttonHref: module.button_link ? resolveHref(link ?? undefined) : fallbackHero.buttonHref,
    overlay: module.overlay_link === true,
    image: imageValue(module.image),
  };
}

function mapModule(
  module: StoryblokRecord,
  index: number,
  preserveEmpty = false,
): ServiceModuleContent {
  const fallback = preserveEmpty ? "" : undefined;

  return {
    id: blockId(module, index, "service"),
    anchor: anchorValue(module.anchor),
    eyebrow: textValue(module.eyebrow, fallback ?? fallbackServiceModule.eyebrow),
    headline: textValue(module.headline, fallback ?? fallbackServiceModule.headline),
    text: textValue(module.text, fallback ?? fallbackServiceModule.text),
    richText: null,
    image: imageValue(module.image),
    links: preserveEmpty ? serviceLinks(module.links) : linkValue(module.links),
    portrait: false,
  };
}

function trimmedField(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function anchorValue(value: unknown) {
  return trimmedField(value).replace(/^#/, "");
}

function mapContentService(module: StoryblokRecord, index: number): ServiceModuleContent {
  const service = serviceLinks(module.links);

  return {
    id: blockId(module, index, "content-service"),
    anchor: anchorValue(module.anchor),
    eyebrow: trimmedField(module.eyebrow),
    headline: trimmedField(module.headline),
    text: "",
    richText: richTextValue(module.body),
    image: imageValue(module.image),
    links: service.length > 0 ? service : contentLinks(module.links),
    portrait: module.portrait === true,
  };
}

function mapContentHero(module: StoryblokRecord, index: number): ContentHeroContent {
  return {
    id: blockId(module, index, "content-hero"),
    anchor: anchorValue(module.anchor),
    eyebrow: trimmedField(module.eyebrow),
    headline: trimmedField(module.headline),
    image: imageValue(module.image),
    body: richTextValue(module.body),
    links: contentLinks(module.links),
  };
}

function isLegacyContentHero(record: StoryblokRecord) {
  return (
    trimmedField(record.eyebrow).length > 0 &&
    trimmedField(record.headline).length === 0 &&
    paragraphsValue(record.text).length > 0 &&
    serviceLinks(record.links).length > 0
  );
}

function mapLegacyContentHero(module: StoryblokRecord, index: number): ContentHeroContent {
  return {
    id: blockId(module, index, "content-hero"),
    anchor: anchorValue(module.anchor),
    eyebrow: trimmedField(module.eyebrow),
    headline: trimmedField(module.headline),
    image: imageValue(module.image),
    body: richTextValue(module.text),
    links: serviceLinks(module.links),
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
    anchor: anchorValue(module.anchor),
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
    anchor: anchorValue(module.anchor),
    eyebrow: textValue(module.eyebrow, fallbackImageTeaser.eyebrow),
    headline: textValue(module.headline, fallbackImageTeaser.headline),
    text: textValue(module.text, fallbackImageTeaser.text),
    linkLabel: textValue(module.link_label, fallbackImageTeaser.linkLabel),
    href: module.link ? resolveHref(link ?? undefined) : fallbackImageTeaser.href,
    image: imageValue(module.image),
    overlay: overlayValue(module.overlay),
  };
}

function infoLinks(value: unknown): ServiceLink[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    const record = asRecord(item);

    if (!record || record.component !== "info_link" || typeof record.label !== "string") {
      return [];
    }

    const name = record.label.trim();

    if (!name) {
      return [];
    }

    const link = asRecord(record.link) as StoryblokLink | null;

    return [{ name, href: resolveHref(link ?? undefined) }];
  });
}

function mapInfoPanel(module: StoryblokRecord, index: number): InfoPanelContent {
  return {
    id: blockId(module, index, "info-panel"),
    anchor: anchorValue(module.anchor),
    eyebrow: textValue(module.eyebrow, fallbackInfoPanel.eyebrow),
    headline: textValue(module.headline, fallbackInfoPanel.headline),
    body: textValue(module.body, fallbackInfoPanel.body),
    links: infoLinks(module.links),
  };
}

const fallbackBooking: BookingContent = {
  id: "fallback-booking",
  anchor: "",
  headline: "Individuelle Beratung",
  body: "Wir nehmen uns Zeit für Ihre Fragen und beraten Sie persönlich zur passenden Behandlung.",
  bookingLabel: "Termin buchen",
  bookingHref: "/",
  overlay: false,
  phoneLabel: "Jetzt anrufen",
  phoneHref: "tel:+496131227266",
};

function linkedHref(link: StoryblokLink | null, fallback: string) {
  const value =
    link?.linktype === "url" ? link.url || link.cached_url || "" : link?.cached_url || link?.url || "";

  if (!value.trim()) {
    return fallback;
  }

  return resolveHref(link ?? undefined);
}

function mapBooking(module: StoryblokRecord, index: number): BookingContent {
  const bookingLink = asRecord(module.booking_link) as StoryblokLink | null;
  const phoneLink = asRecord(module.phone_link) as StoryblokLink | null;

  return {
    id: blockId(module, index, "booking"),
    anchor: anchorValue(module.anchor),
    headline: textValue(module.headline, fallbackBooking.headline),
    body: textValue(module.body, fallbackBooking.body),
    bookingLabel: textValue(module.booking_label, fallbackBooking.bookingLabel),
    bookingHref: linkedHref(bookingLink, fallbackBooking.bookingHref),
    overlay: module.overlay === true,
    phoneLabel: textValue(module.phone_label, fallbackBooking.phoneLabel),
    phoneHref: linkedHref(phoneLink, fallbackBooking.phoneHref),
  };
}

const fallbackTeamHeadline = "Unser Team";

function mapTeamMember(value: unknown): TeamMember | null {
  const record = asRecord(value);

  if (!record || record.component !== "team_member") {
    return null;
  }

  const name = textValue(record.name, "");
  const role = textValue(record.role, "");
  const image = imageValue(record.image);

  if (!name && !role && !image) {
    return null;
  }

  return { name, role, image };
}

const fallbackGalleryHeadline = "Ein Ort zum Ankommen und Vertrauen";

function mapGalleryImage(value: unknown): GalleryImage | null {
  const record = asRecord(value);

  if (!record || record.component !== "gallery_image") {
    return null;
  }

  const caption = textValue(record.caption, "");
  const image = imageValue(record.image);

  if (!caption && !image) {
    return null;
  }

  return { image, caption };
}

function mapGallery(module: StoryblokRecord, index: number): GalleryContent {
  const images = Array.isArray(module.images)
    ? module.images.flatMap((image) => {
        const mapped = mapGalleryImage(image);

        return mapped ? [mapped] : [];
      })
    : [];

  return {
    id: blockId(module, index, "gallery"),
    anchor: anchorValue(module.anchor),
    headline: textValue(module.headline, fallbackGalleryHeadline),
    body: textValue(module.body, ""),
    images,
  };
}

function mapCasePhoto(value: unknown): CasePhoto | null {
  const record = asRecord(value);

  if (!record || record.component !== "case_photo") {
    return null;
  }

  const caption = trimmedField(record.caption);
  const image = imageValue(record.image);

  if (!caption && !image) {
    return null;
  }

  return { image, caption };
}

function mapFaqItem(value: unknown): FaqItem | null {
  const record = asRecord(value);

  if (!record || record.component !== "faq_item") {
    return null;
  }

  const question = trimmedField(record.question);
  const answer = richTextValue(record.answer);

  if (!question && answer.blocks.length === 0) {
    return null;
  }

  return {
    question,
    answer,
    anchor: anchorValue(record.anchor),
  };
}

function mapFaq(module: StoryblokRecord, index: number): FaqContent {
  const items = Array.isArray(module.items)
    ? module.items.flatMap((item) => {
        const mapped = mapFaqItem(item);

        return mapped ? [mapped] : [];
      })
    : [];

  return {
    id: blockId(module, index, "faq"),
    anchor: anchorValue(module.anchor),
    headline: trimmedField(module.headline),
    body: trimmedField(module.body),
    items,
  };
}

function mapCaseStudy(module: StoryblokRecord, index: number): CaseStudyContent {
  const photos = Array.isArray(module.photos)
    ? module.photos.flatMap((photo) => {
        const mapped = mapCasePhoto(photo);

        return mapped ? [mapped] : [];
      })
    : [];

  return {
    id: blockId(module, index, "case-study"),
    anchor: anchorValue(module.anchor),
    eyebrow: trimmedField(module.eyebrow),
    headline: trimmedField(module.headline),
    situationLabel: trimmedField(module.situation_label),
    situation: trimmedField(module.situation),
    treatmentLabel: trimmedField(module.treatment_label),
    treatment: trimmedField(module.treatment),
    resultLabel: trimmedField(module.result_label),
    result: trimmedField(module.result),
    photos,
  };
}

function mapTeamGrid(module: StoryblokRecord, index: number): TeamGridContent {
  const members = Array.isArray(module.members)
    ? module.members.flatMap((member) => {
        const mapped = mapTeamMember(member);

        return mapped ? [mapped] : [];
      })
    : [];

  return {
    id: blockId(module, index, "team-grid"),
    anchor: anchorValue(module.anchor),
    headline: textValue(module.headline, fallbackTeamHeadline),
    members,
  };
}

function mapQuote(module: StoryblokRecord, index: number): QuoteContent {
  return {
    id: blockId(module, index, "quote"),
    anchor: anchorValue(module.anchor),
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
    } else if (record.component === "trust_band") {
      blocks.push({ kind: "trust-band", trust: mapTrustBand(record, index) });
    } else if (record.component === "content_hero") {
      blocks.push({ kind: "content-hero", contentHero: mapContentHero(record, index) });
    } else if (record.component === "content_service") {
      blocks.push({ kind: "content-service", contentService: mapContentService(record, index) });
    } else if (record.component === "service_module") {
      blocks.push({ kind: "service", service: mapModule(record, index) });
    } else if (record.component === "quote") {
      blocks.push({ kind: "quote", quote: mapQuote(record, index) });
    } else if (record.component === "age_groups") {
      blocks.push({ kind: "age-groups", ageGroups: mapAgeGroups(record, index) });
    } else if (record.component === "image_teaser") {
      blocks.push({ kind: "image-teaser", teaser: mapImageTeaser(record, index) });
    } else if (record.component === "info_panel") {
      blocks.push({ kind: "info-panel", info: mapInfoPanel(record, index) });
    } else if (record.component === "booking") {
      blocks.push({ kind: "booking", booking: mapBooking(record, index) });
    } else if (record.component === "team_grid") {
      blocks.push({ kind: "team-grid", teamGrid: mapTeamGrid(record, index) });
    } else if (record.component === "gallery") {
      blocks.push({ kind: "gallery", gallery: mapGallery(record, index) });
    } else if (record.component === "case_study") {
      blocks.push({ kind: "case-study", caseStudy: mapCaseStudy(record, index) });
    } else if (record.component === "faq") {
      blocks.push({ kind: "faq", faq: mapFaq(record, index) });
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

  if (!blocks.some((block) => block.kind === "trust-band")) {
    blocks.unshift({ kind: "trust-band", trust: fallbackTrustBand });
  }

  if (!blocks.some((block) => block.kind === "info-panel")) {
    blocks.push({ kind: "info-panel", info: fallbackInfoPanel });
  }

  return [{ kind: "hero", hero: hero ?? fallbackHero }, ...blocks];
}

function toStoryBlocks(records: StoryblokRecord[], legacyContentHero = false): HomeBlock[] {
  const blocks: HomeBlock[] = [];
  const hasContentHero = records.some((record) => record.component === "content_hero");

  records.forEach((record, index) => {
    if (record.component === "hero") {
      blocks.push({ kind: "hero", hero: mapHero(record, index) });
    } else if (record.component === "trust_band") {
      blocks.push({ kind: "trust-band", trust: mapTrustBand(record, index) });
    } else if (record.component === "content_hero") {
      blocks.push({ kind: "content-hero", contentHero: mapContentHero(record, index) });
    } else if (record.component === "content_service") {
      blocks.push({ kind: "content-service", contentService: mapContentService(record, index) });
    } else if (record.component === "service_module") {
      if (legacyContentHero && !hasContentHero && isLegacyContentHero(record)) {
        blocks.push({ kind: "content-hero", contentHero: mapLegacyContentHero(record, index) });
      } else {
        blocks.push({ kind: "service", service: mapModule(record, index, true) });
      }
    } else if (record.component === "quote") {
      blocks.push({ kind: "quote", quote: mapQuote(record, index) });
    } else if (record.component === "age_groups") {
      blocks.push({ kind: "age-groups", ageGroups: mapAgeGroups(record, index) });
    } else if (record.component === "image_teaser") {
      blocks.push({ kind: "image-teaser", teaser: mapImageTeaser(record, index) });
    } else if (record.component === "info_panel") {
      blocks.push({ kind: "info-panel", info: mapInfoPanel(record, index) });
    } else if (record.component === "booking") {
      blocks.push({ kind: "booking", booking: mapBooking(record, index) });
    } else if (record.component === "team_grid") {
      blocks.push({ kind: "team-grid", teamGrid: mapTeamGrid(record, index) });
    } else if (record.component === "gallery") {
      blocks.push({ kind: "gallery", gallery: mapGallery(record, index) });
    } else if (record.component === "case_study") {
      blocks.push({ kind: "case-study", caseStudy: mapCaseStudy(record, index) });
    } else if (record.component === "faq") {
      blocks.push({ kind: "faq", faq: mapFaq(record, index) });
    }
  });

  return blocks;
}

async function readStoryBody(token: string, region: string, slug: string, version: string) {
  const url = new URL(`/v2/cdn/stories/${slug}`, apiBase(region));
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

async function readHomeBlocks(token: string, region: string, version: string) {
  return readStoryBody(token, region, "home", version);
}

const fallbackHomeBlocks: HomeBlock[] = [
  { kind: "hero", hero: fallbackHero },
  { kind: "trust-band", trust: fallbackTrustBand },
  { kind: "service", service: fallbackServiceModule },
  { kind: "quote", quote: fallbackQuote },
  { kind: "age-groups", ageGroups: fallbackAgeGroups },
  { kind: "image-teaser", teaser: fallbackImageTeaser },
  { kind: "info-panel", info: fallbackInfoPanel },
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

async function loadStoryBlocks(token: string, region: string, slug: string) {
  try {
    const published = await readStoryBody(token, region, slug, "published");

    if (published) {
      return toStoryBlocks(published, slug === "behandlungsspektrum");
    }

    const draft = await readStoryBody(token, region, slug, "draft");

    if (draft) {
      return toStoryBlocks(draft, slug === "behandlungsspektrum");
    }
  } catch {
    return [];
  }

  return [];
}

export async function getStoryBlocks(slug: string) {
  const token = process.env.STORYBLOK_TOKEN;

  if (!token) {
    return [];
  }

  return loadStoryBlocks(token, process.env.STORYBLOK_REGION || "eu", slug);
}
