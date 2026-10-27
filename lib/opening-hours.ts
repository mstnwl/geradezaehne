export const fallbackOpeningHours = [
  "Unsere Sprechzeiten:",
  "Mo - Do: 8.30 – 12:00 Uhr, 13.00 – 17.00 Uhr",
  "Fr: 8.30 – 12:00 Uhr",
];

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
      return fallbackOpeningHours;
    }

    const data = (await response.json()) as {
      story?: { content?: { lines?: unknown } };
    };
    const lines = mapLines(data.story?.content?.lines);

    return lines.length > 0 ? lines : fallbackOpeningHours;
  } catch {
    return fallbackOpeningHours;
  }
}

export async function getOpeningHours() {
  const token = process.env.STORYBLOK_TOKEN;

  if (!token) {
    return fallbackOpeningHours;
  }

  return loadOpeningHours(token, process.env.STORYBLOK_REGION || "eu");
}
