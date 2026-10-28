export type RichMark =
  | { type: "bold" }
  | { type: "italic" }
  | { type: "link"; href: string; target?: "_blank" };

export type RichInline = { type: "text"; text: string; marks: RichMark[] } | { type: "break" };

export type RichBlock =
  | { type: "paragraph"; content: RichInline[] }
  | { type: "bullet_list"; items: RichBlock[][] }
  | { type: "ordered_list"; items: RichBlock[][] };

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

function parseBlocks(value: unknown): RichBlock[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    const node = asRecord(item);

    if (!node || typeof node.type !== "string") {
      return [];
    }

    if (node.type === "paragraph" || node.type === "heading") {
      const content = parseInlines(node.content);

      return inlineHasContent(content) ? [{ type: "paragraph" as const, content }] : [];
    }

    if (node.type === "bullet_list" || node.type === "ordered_list") {
      const items = parseListItems(node.content);

      return items.length > 0 ? [{ type: node.type, items }] : [];
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
