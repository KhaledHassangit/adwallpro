import type { MetadataRoute } from "next";
import { initialCategories } from "@/data/categories";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://adwallpro.com";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${site}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${site}/ad/new`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${site}/admin`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = initialCategories.map((c) => ({
    url: `${site}/companies/category/${c._id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages];
}
