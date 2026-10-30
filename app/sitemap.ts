import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/posts";
import { siteOrigin, sitePaths } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();

  return [
    ...sitePaths.map((path) => ({
      url: path === "/" ? siteOrigin : `${siteOrigin}${path}`,
    })),
    ...posts.map((post) => ({
      url: `${siteOrigin}/news/${post.slug}`,
      lastModified: /^\d{4}-\d{2}-\d{2}$/.test(post.dateTime)
        ? new Date(`${post.dateTime}T00:00:00.000Z`)
        : undefined,
    })),
  ];
}
