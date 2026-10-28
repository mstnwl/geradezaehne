export type FooterLink = {
  label: string;
  href: string;
};

export type FooterGroup = {
  title: string;
  links: FooterLink[];
};

export type FooterContent = {
  practiceName: string;
  specialty: string;
  street: string;
  city: string;
  phone: string;
  fax: string;
  email: string;
  groups: FooterGroup[];
};

const fallbackGroups: FooterGroup[] = [
  {
    title: "Ressourcen",
    links: [
      { label: "Anamnesebogen", href: "/" },
      { label: "FAQ", href: "/" },
      { label: "Tipps", href: "/" },
      { label: "Notfälle", href: "/" },
      { label: "News", href: "/" },
    ],
  },
  {
    title: "Links",
    links: [
      { label: "Startseite", href: "/" },
      { label: "Termin buchen", href: "/" },
      { label: "Behandler & Team", href: "/" },
      { label: "Behandlungsspektrum", href: "/" },
      { label: "Fallbeispiele", href: "/" },
      { label: "Praxis", href: "/" },
      { label: "Jobs", href: "/" },
      { label: "Kontakt", href: "/" },
    ],
  },
  {
    title: "Rechtliches",
    links: [
      { label: "Impressum", href: "/" },
      { label: "Datenschutz", href: "/" },
    ],
  },
];

const fallbackFooter: FooterContent = {
  practiceName: "Praxis Dr. Hück",
  specialty: "Fachzahnärzte für Kieferorthopädie",
  street: "Münsterstraße 15",
  city: "55116 Mainz",
  phone: "Telefon: (06131) 22 72 66",
  fax: "Telefax: (06131) 23 06 11",
  email: "E-Mail: info@gerade-zaehne.com",
  groups: fallbackGroups,
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

function mapLinks(value: unknown): FooterLink[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    const record = asRecord(item);

    if (!record || record.component !== "footer_link") {
      return [];
    }

    const label = typeof record.label === "string" ? record.label.trim() : "";

    if (!label) {
      return [];
    }

    const link = asRecord(record.link) as StoryblokLink | null;

    return [{ label, href: resolveHref(link ?? undefined) }];
  });
}

function mapGroups(value: unknown): FooterGroup[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    const record = asRecord(item);

    if (!record || record.component !== "footer_group") {
      return [];
    }

    const title = typeof record.title === "string" ? record.title.trim() : "";
    const links = mapLinks(record.links);

    if (!title && links.length === 0) {
      return [];
    }

    return [{ title, links }];
  });
}

function mapFooter(content: StoryblokRecord): FooterContent {
  const groups = mapGroups(content.groups);

  return {
    practiceName: textValue(content.practice_name, fallbackFooter.practiceName),
    specialty: textValue(content.specialty, fallbackFooter.specialty),
    street: textValue(content.street, fallbackFooter.street),
    city: textValue(content.city, fallbackFooter.city),
    phone: textValue(content.phone, fallbackFooter.phone),
    fax: textValue(content.fax, fallbackFooter.fax),
    email: textValue(content.email, fallbackFooter.email),
    groups: groups.length > 0 ? groups : fallbackFooter.groups,
  };
}

async function loadFooter(token: string, region: string) {
  try {
    const url = new URL("/v2/cdn/stories/footer", apiBase(region));
    url.searchParams.set("version", "published");
    url.searchParams.set("token", token);

    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      return fallbackFooter;
    }

    const data = (await response.json()) as {
      story?: { content?: StoryblokRecord };
    };
    const content = data.story?.content;

    return content ? mapFooter(content) : fallbackFooter;
  } catch {
    return fallbackFooter;
  }
}

export async function getFooter() {
  const token = process.env.STORYBLOK_TOKEN;

  if (!token) {
    return fallbackFooter;
  }

  return loadFooter(token, process.env.STORYBLOK_REGION || "eu");
}
