import type { MetadataRoute } from "next"
import { fetchPosts } from "@/services/blog-service"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all blog posts
  const posts = await fetchPosts({ size: "100" })

  // Base URL
  const baseUrl = "https://holyfit.co.uk"

  // Static routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ] as MetadataRoute.Sitemap

  // Add blog post routes
  const postRoutes = posts.results.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date || Date.now()),
    changeFrequency: "monthly",
    priority: 0.6,
  })) as MetadataRoute.Sitemap

  return [...routes, ...postRoutes]
}
