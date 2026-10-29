export type SprechzeitenImage = {
  src: string;
  alt: string;
};

export type HoursRow = {
  day: string;
  morning: string;
  afternoon: string;
};

export type SprechzeitenContent = {
  id: string;
  headline: string;
  image: SprechzeitenImage | null;
  hours: HoursRow[];
  body: string;
  bookingLabel: string;
  bookingHref: string;
  overlay: boolean;
  phoneLabel: string;
  phoneHref: string;
};

const fallbackSprechzeiten: SprechzeitenContent = {
  id: "fallback-sprechzeiten",
  headline: "Sprechzeiten",
  image: null,
  hours: [
    { day: "Mo / Di / Mi", morning: "08.30 – 12:00", afternoon: "13.00 – 17.00" },
    { day: "Do", morning: "08.30 – 13:00", afternoon: "14.00 – 19.00" },
    { day: "Fr", morning: "08.30 – 12:00", afternoon: "" },
  ],
  body: "Um Ihnen möglichst kurze Wartezeiten zu garantieren, bitten wir Sie, telefonisch oder online einen Termin zu vereinbaren.",
  bookingLabel: "Termin buchen",
  bookingHref: "#",
  overlay: false,
  phoneLabel: "Jetzt anrufen",
  phoneHref: "tel:+496131227266",
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

function asRecord(value: unknown): StoryblokRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as StoryblokRecord;
}

function textValue(value: unknown, fallback: string) {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();

  return trimmed || fallback;
}

function resolveHref(link: StoryblokLink | undefined, fallback: string) {
  const value =
    link?.linktype === "url"
      ? link.url || link.cached_url || ""
      : link?.cached_url || link?.url || "";
  const trimmed = value.trim();

  if (!trimmed || trimmed === "home") {
    return fallback;
  }

  if (trimmed.startsWith("#") || /^(https?:|mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function imageValue(value: unknown): SprechzeitenImage | null {
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

function hoursValue(value: unknown): HoursRow[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    const record = asRecord(item);

    if (!record || record.component !== "hours_row") {
      return [];
    }

    const day = typeof record.day === "string" ? record.day.trim() : "";
    const morning = typeof record.morning === "string" ? record.morning.trim() : "";
    const afternoon = typeof record.afternoon === "string" ? record.afternoon.trim() : "";

    if (!day && !morning && !afternoon) {
      return [];
    }

    return [{ day, morning, afternoon }];
  });
}

function mapSprechzeiten(record: StoryblokRecord, index: number): SprechzeitenContent {
  const uid = typeof record._uid === "string" ? record._uid.trim() : "";
  const hours = hoursValue(record.hours);
  const bookingLink = asRecord(record.booking_link) as StoryblokLink | null;
  const phoneLink = asRecord(record.phone_link) as StoryblokLink | null;

  return {
    id: uid || `sprechzeiten-${index}`,
    headline: textValue(record.headline, fallbackSprechzeiten.headline),
    image: imageValue(record.image),
    hours: hours.length > 0 ? hours : fallbackSprechzeiten.hours,
    body: textValue(record.body, fallbackSprechzeiten.body),
    bookingLabel: textValue(record.booking_label, fallbackSprechzeiten.bookingLabel),
    bookingHref: record.booking_link
      ? resolveHref(bookingLink ?? undefined, fallbackSprechzeiten.bookingHref)
      : fallbackSprechzeiten.bookingHref,
    overlay: record.overlay_booking === true,
    phoneLabel: textValue(record.phone_label, fallbackSprechzeiten.phoneLabel),
    phoneHref: record.phone_link
      ? resolveHref(phoneLink ?? undefined, fallbackSprechzeiten.phoneHref)
      : fallbackSprechzeiten.phoneHref,
  };
}

async function readSprechzeiten(token: string, region: string, version: string) {
  const url = new URL("/v2/cdn/stories/sprechzeiten", apiBase(region));
  url.searchParams.set("version", version);
  url.searchParams.set("token", token);

  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as {
    story?: { content?: StoryblokRecord };
  };

  return data.story?.content ?? null;
}

export async function getSprechzeiten() {
  const token = process.env.STORYBLOK_TOKEN;

  if (!token) {
    return fallbackSprechzeiten;
  }

  const region = process.env.STORYBLOK_REGION || "eu";

  try {
    const published = await readSprechzeiten(token, region, "published");

    if (published) {
      return mapSprechzeiten(published, 0);
    }

    const draft = await readSprechzeiten(token, region, "draft");

    if (draft) {
      return mapSprechzeiten(draft, 0);
    }
  } catch {
    return fallbackSprechzeiten;
  }

  return fallbackSprechzeiten;
}
