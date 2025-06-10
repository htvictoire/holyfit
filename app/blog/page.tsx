import { Suspense } from "react"
import { fetchPosts, fetchCategories, fetchTags, fetchAuthors } from "@/services/blog-service"
import BlogContent from "@/components/blog/blog-content"
import { Dumbbell } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import LoadingSpinner from "@/components/ui/loading-spinner"

interface BlogPageProps {
  searchParams: Record<string, string>
}

export const metadata: Metadata = {
  title: "Fitness Knowledge Hub | HolyFit Blog",
  description:
    "Discover the latest fitness tips, nutrition advice, and success stories from our community of experts at HolyFit.",
  keywords: "fitness blog, workout tips, nutrition advice, health articles, fitness success stories",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Fitness Knowledge Hub | HolyFit Blog",
    description:
      "Discover the latest fitness tips, nutrition advice, and success stories from our community of experts.",
    url: "https://holyfit.co.uk/blog",
    siteName: "HolyFit",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/blog-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HolyFit Blog - Fitness Knowledge Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fitness Knowledge Hub | HolyFit Blog",
    description:
      "Discover the latest fitness tips, nutrition advice, and success stories from our community of experts.",
    images: ["/twitter-image.jpg"],
  },
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  // Filter out any undefined parameters to prevent unnecessary API calls
  const cleanParams = Object.fromEntries(
    Object.entries(searchParams).filter(([_, value]) => value !== undefined && value !== null && value !== '')
  );
  
  // API request parameters with defaults for pagination and ordering
  const apiParams: Record<string, string> = {
    size: "10",
    ordering: "-date",
    ...cleanParams
  };
  
  try {
    // Fetch data in parallel with clean parameters
    const [posts, categories, tags, authors] = await Promise.all([
      fetchPosts(apiParams),
      fetchCategories(),
      fetchTags(),
      fetchAuthors(),
    ]);

    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="relative bg-dark py-20 mb-12">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-30"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm">
                  <Dumbbell className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Fitness Knowledge Hub</h1>
              <p className="text-white/80 max-w-2xl mx-auto text-lg">
                Discover the latest fitness tips, nutrition advice, and success stories from our community of experts
              </p>
              <div className="flex justify-center space-x-4 mt-6">
                <Link
                  href="/"
                  className="text-white/80 hover:text-white text-lg font-medium transition-colors"
                >
                  HolyFit
                </Link>
                <span className="text-white/50">/</span>
                <Link
                  href="/blog"
                  className="text-white/80 hover:text-white text-lg font-medium transition-colors"
                >
                  Blog
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-20">
          <Suspense fallback={<LoadingSpinner />}>
            <BlogContent 
              initialPosts={posts} 
              initialParams={apiParams}
              categories={categories} 
              tags={tags}
              authors={authors}
            />
          </Suspense>
        </div>
      </div>
    )
  } catch (error) {
    // Handle errors gracefully
    console.error("Error loading blog data:", error)
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-20">
          <div className="bg-white p-8 rounded-xl shadow text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to load blog content</h2>
            <p className="text-gray-600 mb-6">
              We're having trouble loading the blog content right now. Please try again later.
            </p>
            <Link
              href="/"
              className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors inline-block"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
