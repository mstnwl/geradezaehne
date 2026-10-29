export const fallbackOpeningHours = [
  "Unsere Sprechzeiten:",
  "Mo - Do: 8.30 – 12:00 Uhr, 13.00 – 17.00 Uhr",
  "Fr: 8.30 – 12:00 Uhr",
];

export type OpeningHoursContent = {
  lines: string[];
  phoneNumber: string;
  phoneHref: string;
  bookingLabel: string;
  bookingHref: string;
  overlay: boolean;
};

const fallbackOpeningHoursContent: OpeningHoursContent = {
  lines: fallbackOpeningHours,
  phoneNumber: "",
  phoneHref: "",
  bookingLabel: "",
  bookingHref: "",
  overlay: false,
};

type StoryblokLink = {
  linktype?: string;
  url?: string;
  cached_url?: string;
};

type StoryblokOpeningLine = {
  component?: string;
  text?: unknown;
  Text?: unknown;
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

function textField(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function linkHref(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return "";
  }

  const link = value as StoryblokLink;
  const raw =
    link.linktype === "url" ? link.url || link.cached_url || "" : link.cached_url || link.url || "";
  const trimmed = raw.trim();

  if (!trimmed || trimmed === "home") {
    return "";
  }

  if (trimmed.startsWith("#") || /^(https?:|mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function lineText(block: StoryblokOpeningLine) {
  if (typeof block.Text === "string" && block.Text.trim()) {
    return block.Text.trim();
  }

  if (typeof block.text === "string") {
    return block.text.trim();
  }

  return "";
}

function mapLines(lines: unknown) {
  if (!Array.isArray(lines)) {
    return [];
  }

  return lines.flatMap((line) => {
    if (!line || typeof line !== "object") {
      return [];
    }

    const block = line as StoryblokOpeningLine;

    if (block.component !== "opening_hours_line") {
      return [];
    }

    const text = lineText(block);

    return text ? [text] : [];
  });
}

async function loadOpeningHours(token: string, region: string) {
  try {
    const url = new URL("/v2/cdn/stories/opening-hours", apiBase(region));
    url.searchParams.set("version", "published");
    url.searchParams.set("token", token);

    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      return fallbackOpeningHoursContent;
    }

    const data = (await response.json()) as {
      story?: {
        content?: {
          lines?: unknown;
          phone_number?: unknown;
          phone_link?: unknown;
          booking_label?: unknown;
          booking_link?: unknown;
          overlay?: unknown;
        };
      };
    };
    const content = data.story?.content;
    const lines = mapLines(content?.lines);

    return {
      lines: lines.length > 0 ? lines : fallbackOpeningHours,
      phoneNumber: textField(content?.phone_number),
      phoneHref: linkHref(content?.phone_link),
      bookingLabel: textField(content?.booking_label),
      bookingHref: linkHref(content?.booking_link),
      overlay: content?.overlay === true,
    };
  } catch {
    return fallbackOpeningHoursContent;
  }
}

export async function getOpeningHours() {
  const token = process.env.STORYBLOK_TOKEN;

  if (!token) {
    return fallbackOpeningHoursContent;
  }

  return loadOpeningHours(token, process.env.STORYBLOK_REGION || "eu");
}
