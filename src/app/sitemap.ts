import type { MetadataRoute } from "next";
import { LORE_ARTICLES } from "@/content/lore";
import { SITE } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/privacy",
    "/delete-account",
    "/terms",
    "/lore",
  ].map(
    (path) => ({
      url: `${SITE.url}${path || "/"}`,
      lastModified: new Date("2026-08-26"),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    }),
  );

  const loreRoutes = LORE_ARTICLES.map((article) => ({
    url: `${SITE.url}/lore/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...loreRoutes];
}
