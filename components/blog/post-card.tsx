/**
 * Enhanced post card component for displaying a blog post in a grid with API data
 */
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, Tag, ArrowRight } from "lucide-react"
import type { BlogPost } from "@/types/blog-types"

interface PostCardProps {
  /** Blog post to display */
  post: BlogPost
  /** Optional index for staggered animations */
  index?: number
}

export default function PostCard({ post, index = 0 }: PostCardProps) {
  // Format date for display
  const formattedDate = post.date ? new Date(post.date).toLocaleDateString() : ""

  // Normalize image URL to handle relative or absolute URLs
  const normalizeImageUrl = (url?: string, fallback = "/placeholder.svg"): string => {
    if (!url) return fallback
    
    // If it's already an absolute URL, return it as is
    if (url.startsWith("http")) {
      return url
    }
    
    // If it's a relative URL starting with /, return it as is
    if (url.startsWith("/")) {
      return url
    }
    
    // Otherwise, add a leading / to make it a proper relative URL
    return `/${url}`
  }

  return (
    <div
      className="opacity-0 translate-y-4 animate-[fadeIn_0.5s_ease-out_forwards]"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <Link href={`/blog/${post.slug}`} className="group">
        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-fitness transition-all duration-300 h-full flex flex-col border border-gray-100">
          {/* Post image with gradient overlay */}
          <div className="aspect-[16/9] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-dark/30 to-transparent z-10" />
            <Image
              src={normalizeImageUrl(post.image)}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Category badge */}
            {post.category && (
              <div className="absolute top-3 left-3 bg-primary/90 text-white text-xs px-3 py-1.5 rounded-full z-20 font-medium">
                {post.category.name}
              </div>
            )}
          </div>

          {/* Post content */}
          <div className="p-5 flex-1 flex flex-col">
            <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors mb-3">
              {post.title}
            </h3>

            {/* Post excerpt */}
            {post.excerpt && <p className="text-gray-600 text-sm line-clamp-2 mb-4">{post.excerpt}</p>}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full"
                  >
                    <Tag className="h-3 w-3 mr-1 text-primary" />
                    {tag.name}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="inline-flex items-center bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full">
                    +{post.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Post metadata */}
            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center text-xs text-gray-500 space-x-4">
                {/* Author */}
                {post.author && (
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1 text-primary" />
                    <span>{post.author}</span>
                  </div>
                )}

                {/* Date */}
                {formattedDate && (
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1 text-primary" />
                    <span>{formattedDate}</span>
                  </div>
                )}
              </div>

              {/* Read more indicator */}
              <div className="text-primary text-xs font-medium flex items-center opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                Read more
                <ArrowRight className="h-3 w-3 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
