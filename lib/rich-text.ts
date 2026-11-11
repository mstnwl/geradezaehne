export type RichMark =
  | { type: "bold" }
  | { type: "italic" }
  | { type: "link"; href: string; target?: "_blank" };

export type RichInline = { type: "text"; text: string; marks: RichMark[] } | { type: "break" };

export type RichHeadingLevel = 1 | 2 | 3 | 4;

export type RichBlock =
  | { type: "paragraph"; content: RichInline[] }
  | { type: "heading"; level: RichHeadingLevel; content: RichInline[] }
  | { type: "bullet_list"; items: RichBlock[][] }
  | { type: "ordered_list"; items: RichBlock[][] }
  | { type: "image"; src: string; alt: string };

export type RichTextDoc = {
  blocks: RichBlock[];
};

type StoryblokRecord = Record<string, unknown>;

function asRecord(value: unknown): StoryblokRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as StoryblokRecord;
}

function linkHref(attrs: StoryblokRecord | null) {
  if (!attrs) {
    return null;
  }

  const linktype = typeof attrs.linktype === "string" ? attrs.linktype : "url";
  const raw = typeof attrs.href === "string" ? attrs.href.trim() : "";
  const anchor = typeof attrs.anchor === "string" ? attrs.anchor.trim().replace(/^#/, "") : "";

  if (!raw && !anchor) {
    return null;
  }

  if (/^(javascript|data):/i.test(raw)) {
    return null;
  }

  let href = raw;

  if (linktype === "email" && href && !/^mailto:/i.test(href)) {
    href = `mailto:${href}`;
  }

  if (!href || href === "home") {
    href = "/";
  } else if (!(href.startsWith("#") || /^(https?:|mailto:|tel:)/i.test(href) || href.startsWith("/"))) {
    href = `/${href}`;
  }

  if (anchor) {
    href = `${href.replace(/#.*$/, "")}#${anchor}`;
  }

  return href;
}

function parseMarks(value: unknown): RichMark[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const marks: RichMark[] = [];

  for (const item of value) {
    const mark = asRecord(item);

    if (!mark) {
      continue;
    }

    if (mark.type === "bold") {
      marks.push({ type: "bold" });
      continue;
    }

    if (mark.type === "italic") {
      marks.push({ type: "italic" });
      continue;
    }

    if (mark.type === "link") {
      const href = linkHref(asRecord(mark.attrs));

      if (href) {
        marks.push({
          type: "link",
          href,
          target: asRecord(mark.attrs)?.target === "_blank" ? "_blank" : undefined,
        });
      }
    }
  }

  return marks;
}

function parseInlines(value: unknown): RichInline[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    const node = asRecord(item);

    if (!node) {
      return [];
    }

    if (node.type === "hard_break") {
      return [{ type: "break" as const }];
    }

    if (node.type === "text" && typeof node.text === "string" && node.text.length > 0) {
      return [{ type: "text" as const, text: node.text, marks: parseMarks(node.marks) }];
    }

    if (Array.isArray(node.content)) {
      return parseInlines(node.content);
    }

    return [];
  });
}

function inlineHasContent(content: RichInline[]) {
  return content.some((node) => node.type === "break" || node.text.length > 0);
}

function textValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function httpUrl(value: unknown) {
  let url = textValue(value);

  if (url.startsWith("//")) {
    url = `https:${url}`;
  }

  if (!url || /^(javascript|data):/i.test(url)) {
    return "";
  }

  return /^https?:\/\//i.test(url) ? url : "";
}

function isImageUrl(src: string) {
  if (/^https?:\/\/a\.storyblok\.com\/f\//i.test(src)) {
    return !/\.(pdf|docx?|xlsx?|pptx?|zip|mp4|mp3|webm|mov)(\?|#|$)/i.test(src);
  }

  return /\.(png|jpe?g|gif|webp|avif|svg)(\?|#|$)/i.test(src);
}

function imageBlock(src: string, alt: string): RichBlock | null {
  if (!src) {
    return null;
  }

  return { type: "image", src, alt };
}

function imageFromAttrs(attrs: unknown): RichBlock | null {
  const record = asRecord(attrs);

  if (!record) {
    return null;
  }

  const meta = asRecord(record.meta_data);
  const src = httpUrl(record.src) || httpUrl(record.filename);
  const alt = textValue(record.alt) || textValue(meta?.alt) || textValue(record.title) || textValue(meta?.title);

  return imageBlock(src, alt);
}

function imageFromField(value: unknown): RichBlock | null {
  if (typeof value === "string") {
    const src = httpUrl(value);

    return src && isImageUrl(src) ? imageBlock(src, "") : null;
  }

  const asset = asRecord(value);

  if (!asset) {
    return null;
  }

  const filename = httpUrl(asset.filename);
  const src = filename || (asset.fieldtype === "asset" ? httpUrl(asset.src) : "");

  if (!src || !isImageUrl(src)) {
    return null;
  }

  const meta = asRecord(asset.meta_data);
  const alt = textValue(asset.alt) || textValue(meta?.alt) || textValue(asset.title) || textValue(meta?.title);

  return imageBlock(src, alt);
}

function imagesFromValue(value: unknown): RichBlock[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => imagesFromValue(item));
  }

  const image = imageFromField(value);

  return image ? [image] : [];
}

function imagesFromBlok(attrs: unknown): RichBlock[] {
  const body = asRecord(attrs)?.body;

  if (!Array.isArray(body)) {
    return [];
  }

  return body.flatMap((item) => {
    const component = asRecord(item);

    if (!component) {
      return [];
    }

    const direct = imageFromField(component);

    if (direct) {
      return [direct];
    }

    return Object.entries(component).flatMap(([key, field]) => {
      if (key === "component" || key.startsWith("_")) {
        return [];
      }

      return imagesFromValue(field);
    });
  });
}

function embeddedImages(node: StoryblokRecord): RichBlock[] {
  if (node.type === "image") {
    const image = imageFromAttrs(node.attrs);

    return image ? [image] : [];
  }

  if (node.type === "blok") {
    return imagesFromBlok(node.attrs);
  }

  return [];
}

function parseParagraph(value: unknown): RichBlock[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const blocks: RichBlock[] = [];
  let inlines: RichInline[] = [];

  const flush = () => {
    if (inlineHasContent(inlines)) {
      blocks.push({ type: "paragraph", content: inlines });
    }

    inlines = [];
  };

  for (const item of value) {
    const node = asRecord(item);

    if (node && (node.type === "image" || node.type === "blok")) {
      const images = embeddedImages(node);

      if (images.length > 0) {
        flush();
        blocks.push(...images);
      }

      continue;
    }

    if (node) {
      inlines.push(...parseInlines([node]));
    }
  }

  flush();

  return blocks;
}

function parseListItems(value: unknown): RichBlock[][] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    const node = asRecord(item);

    if (!node) {
      return [];
    }

    const blocks = Array.isArray(node.content) ? parseBlocks(node.content) : [];

    return blocks.length > 0 ? [blocks] : [];
  });
}

function headingLevel(value: unknown): RichHeadingLevel {
  const level = typeof value === "number" ? value : typeof value === "string" ? Number(value) : Number.NaN;

  if (level <= 1) {
    return 1;
  }

  if (level === 2) {
    return 2;
  }

  if (level === 3) {
    return 3;
  }

  return 4;
}

function parseBlocks(value: unknown): RichBlock[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    const node = asRecord(item);

    if (!node || typeof node.type !== "string") {
      return [];
    }

    if (node.type === "heading") {
      const content = parseInlines(node.content);

      return inlineHasContent(content)
        ? [{ type: "heading" as const, level: headingLevel(asRecord(node.attrs)?.level), content }]
        : [];
    }

    if (node.type === "paragraph") {
      return parseParagraph(node.content);
    }

    if (node.type === "bullet_list" || node.type === "ordered_list") {
      const items = parseListItems(node.content);

      return items.length > 0 ? [{ type: node.type, items }] : [];
    }

    if (node.type === "image" || node.type === "blok") {
      return embeddedImages(node);
    }

    if (Array.isArray(node.content)) {
      return parseBlocks(node.content);
    }

    return [];
  });
}

export function richTextValue(value: unknown): RichTextDoc {
  if (typeof value === "string") {
    return {
      blocks: value
        .split(/\n+/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
        .map((text) => ({
          type: "paragraph" as const,
          content: [{ type: "text" as const, text, marks: [] }],
        })),
    };
  }

  const doc = asRecord(value);

  if (!doc || !Array.isArray(doc.content)) {
    return { blocks: [] };
  }

  return { blocks: parseBlocks(doc.content) };
}
