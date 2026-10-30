import type { Metadata } from "next";
import type { RichBlock, RichInline, RichTextDoc } from "@/lib/rich-text";
import type { HomeBlock, ServiceModuleContent } from "@/lib/service-module";
import { getHomeBlocks, getStoryBlocks } from "@/lib/service-module";

export const siteName = "Praxis Dr. Hück";
export const siteOrigin = "https://geradezaehne.vercel.app";
export const siteDescription = "Praxis Dr. Hück, Fachzahnärzte für Kieferorthopädie.";

export const sitePaths = [
  "/",
  "/praxis",
  "/team",
  "/behandlungsspektrum",
  "/fallbeispiele",
  "/news",
  "/karriere",
  "/kontakt",
  "/faq",
  "/sos",
  "/tipps",
  "/impressum",
  "/datenschutz",
];

function clip(value: string) {
  const text = value.replace(/\s+/g, " ").trim();

  if (text.length <= 160) {
    return text;
  }

  const cut = text.slice(0, 157);
  const space = cut.lastIndexOf(" ");

  return `${(space > 80 ? cut.slice(0, space) : cut).trim()}…`;
}

function inlineText(content: RichInline[]) {
  return content
    .map((node) => (node.type === "text" ? node.text : ""))
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

export function firstRichText(document: RichTextDoc) {
  return firstBlocks(document.blocks);
}

function firstBlocks(blocks: RichBlock[]): string {
  for (const block of blocks) {
    if (block.type === "paragraph") {
      const text = inlineText(block.content);

      if (text) {
        return text;
      }
    }

    if (block.type === "bullet_list" || block.type === "ordered_list") {
      for (const item of block.items) {
        const text = firstBlocks(item);

        if (text) {
          return text;
        }
      }
    }
  }

  return "";
}

function isFallback(id: string) {
  return id === "fallback" || id.startsWith("fallback-");
}

function serviceText(service: ServiceModuleContent) {
  if (isFallback(service.id)) {
    return "";
  }

  return (service.richText && firstRichText(service.richText)) || service.text;
}

function blockText(block: HomeBlock) {
  switch (block.kind) {
    case "hero":
      return isFallback(block.hero.id) ? "" : block.hero.copy;
    case "content-hero":
      return isFallback(block.contentHero.id) ? "" : firstRichText(block.contentHero.body);
    case "service":
      return serviceText(block.service);
    case "content-service":
      return serviceText(block.contentService);
    case "info-panel":
      return isFallback(block.info.id) ? "" : block.info.body;
    case "image-teaser":
      return isFallback(block.teaser.id) ? "" : block.teaser.text;
    case "gallery":
      return block.gallery.body;
    case "faq":
      return block.faq.body;
    case "booking":
      return isFallback(block.booking.id) ? "" : block.booking.body;
    case "case-study":
      return block.caseStudy.situation;
    case "quote":
      return isFallback(block.quote.id) ? "" : block.quote.quote;
    default:
      return "";
  }
}

export function descriptionFromBlocks(blocks: HomeBlock[]) {
  for (const block of blocks) {
    const text = blockText(block).replace(/\s+/g, " ").trim();

    if (text) {
      return clip(text);
    }
  }

  return "";
}

export function pageMetadata(pageName: string, path: string, description = ""): Metadata {
  const title = pageName === siteName ? siteName : `${pageName} | ${siteName}`;
  const text = clip(description) || siteDescription;
  const canonical = path.startsWith("/") ? path : `/${path}`;

  return {
    title: { absolute: title },
    description: text,
    alternates: { canonical },
    openGraph: {
      title,
      description: text,
      url: canonical,
    },
  };
}

export async function storyMetadata(pageName: string, path: string, slug?: string) {
  const blocks = slug ? await getStoryBlocks(slug) : await getHomeBlocks();

  return pageMetadata(pageName, path, descriptionFromBlocks(blocks));
}
