import { fetchPostBySlug, fetchCategories, fetchTags } from "@/services/blog-service";
import Link from "next/link";
import { ArrowLeft, Calendar, User, TagIcon, Clock, Share2, Bookmark, Heart, MessageSquare } from "lucide-react";
import { notFound } from "next/navigation";
import { normalizeImageUrl } from "@/utils/image-utils";
import AdPlaceholder from "@/components/blog/ad-placeholder";
import Sidebar from "@/components/blog/sidebar";
import PostContent from "@/components/blog/post-content";
import type { Metadata, ResolvingMetadata } from "next";

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

// Generate metadata for the blog post
export async function generateMetadata({ params }: BlogPostPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = params;
  
  // This is the detail page route, so we should always have a valid slug
  if (!slug) {
    return {
      title: "Post Not Found | HolyFit Blog",
      description: "The requested blog post could not be found.",
    };
  }

  // Fetch post data
  const post = await fetchPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found | HolyFit Blog",
      description: "The requested blog post could not be found.",
    };
  }

  // Use post data for metadata
  return {
    title: `${post.title} | HolyFit Blog`,
    description: post.excerpt || "Read this insightful article from HolyFit's fitness experts.",
    keywords: post.tags?.map((tag) => tag.name).join(", ") || "fitness, health, wellness",
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || "Read this insightful article from HolyFit's fitness experts.",
      url: `https://holyfit.co.uk/blog/${post.slug}`,
      siteName: "HolyFit",
      locale: "en_US",
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags?.map((tag) => tag.name),
      images: [
        {
          url: normalizeImageUrl(post.image) || "/blog-default-image.jpg",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || "Read this insightful article from HolyFit's fitness experts.",
      images: [normalizeImageUrl(post.image) || "/blog-default-image.jpg"],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;
  
  // Next.js route param validation - we should always have a slug at this point
  // This is the [slug] page, so the slug should be a path segment
  if (!slug) {
    notFound();
  }
  
  // Fetch the post using the service - we know the slug is valid at this point
  const post = await fetchPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Fetch categories and tags for the sidebar
  const [categories, tags] = await Promise.all([
    fetchCategories(),
    fetchTags(),
  ]);

  // Format date
  const formattedDate = post.date ? new Date(post.date).toLocaleDateString() : "";

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <Link href="/blog" className="inline-flex items-center text-gray-600 hover:text-primary mb-6 group">
          <div className="bg-white p-2 rounded-full shadow-sm mr-2 group-hover:bg-primary/5 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </div>
          <span className="font-medium">Back to Blog</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <article className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
              <div className="aspect-[16/9] relative">
                <div className="absolute inset-0 bg-gradient-to-t from-dark/50 to-transparent z-10"></div>
                <img
                  src={normalizeImageUrl(post.image)}
                  alt={post.title}
                  className="object-cover w-full h-full"
                />

                {/* Category badge */}
                {post.category && (
                  <div className="absolute top-4 left-4 z-20">
                    <Link
                      href={`/blog?category=${post.category.id}`}
                      className="inline-block bg-primary text-white text-sm px-4 py-1.5 rounded-full font-medium"
                    >
                      {post.category.name}
                    </Link>
                  </div>
                )}
              </div>

              <div className="p-6 md:p-8">
                <div className="mb-6">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    {post.author && (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1.5 text-primary" />
                        <span>{post.author}</span>
                      </div>
                    )}

                    {formattedDate && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1.5 text-primary" />
                        <span>{formattedDate}</span>
                      </div>
                    )}

                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1.5 text-primary" />
                      <span>5 min read</span>
                    </div>
                  </div>
                </div>

                {/* Social sharing and actions */}
                <div className="flex flex-wrap gap-3 mb-8 border-y border-gray-100 py-4">
                  <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary transition-colors">
                    <Heart className="h-4 w-4" />
                    <span>Like</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary transition-colors">
                    <Bookmark className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary transition-colors">
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary transition-colors">
                    <MessageSquare className="h-4 w-4" />
                    <span>Comment</span>
                  </button>
                </div>

                {/* Post Content */}
                {post.components && <PostContent components={post.components} />}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="text-gray-700 font-medium">Tags:</span>
                      {post.tags.map((tag) => (
                        <Link
                          key={tag.id}
                          href={`/blog?tag=${tag.id}`}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-full transition-colors"
                        >
                          <span className="flex items-center">
                            <TagIcon className="h-3 w-3 mr-1 text-primary" />
                            {tag.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>

            {/* Related posts */}
            <div className="mt-12">
              <div className="flex items-center mb-6">
                <div className="bg-primary/10 p-2 rounded-lg mr-3">
                  <TagIcon className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Related Posts</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Placeholder for related posts */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="aspect-video bg-gray-100 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <span>Image</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Related Post Title</h3>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Jan 1, 2023</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="aspect-video bg-gray-100 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <span>Image</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Related Post Title</h3>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Jan 1, 2023</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="aspect-video bg-gray-100 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <span>Image</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Related Post Title</h3>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Jan 1, 2023</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <AdPlaceholder className="h-64" />

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <Sidebar categories={categories} tags={tags} />
              </div>

              <AdPlaceholder className="h-64 mt-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
