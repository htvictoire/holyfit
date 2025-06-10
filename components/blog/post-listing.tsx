/**
 * Simplified post listing component that displays blog posts from the API
 */
"use client"

import React, { useState, useEffect } from "react"
import type { BlogPostsResponse, CategoryItem } from "@/types/blog-types"
import PostCard from "./post-card"
import AdPlaceholder from "./ad-placeholder"
import Pagination from "./pagination"
import { Dumbbell, Filter, Search } from "lucide-react"

interface PostListingProps {
  /** Current posts data */
  posts: BlogPostsResponse
  /** Loading state */
  loading: boolean
  /** Current API parameters */
  params: Record<string, string>
  /** List of all categories */
  categories: CategoryItem[]
  /** Function to call when page changes */
  onPageChange: (page: number) => void
  /** Function to call when page size changes */
  onPageSizeChange: (pageSize: number) => void
}

export default function PostListing({
  posts,
  loading,
  params,
  categories,
  onPageChange,
  onPageSizeChange,
}: PostListingProps) {
  // State for pagination and page size
  const [pageSize, setPageSize] = useState<number>(
    params.size ? parseInt(params.size, 10) : 10
  )
  const [currentPage, setCurrentPage] = useState<number>(
    params.page ? parseInt(params.page, 10) : 1
  )

  // Calculate total pages based on post count and page size
  const totalPages = Math.ceil(posts.count / pageSize)

  // Update local state when params change
  useEffect(() => {
    if (params.page) {
      const page = parseInt(params.page, 10)
      if (page !== currentPage) {
        setCurrentPage(page)
      }
    }
    
    if (params.size) {
      const size = parseInt(params.size, 10)
      if (size !== pageSize) {
        setPageSize(size)
      }
    }
  }, [params, currentPage, pageSize])

  /**
   * Handle change in page size
   */
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(1) // Reset to first page when page size changes
    onPageSizeChange(newSize)
  }

  /**
   * Handle pagination
   */
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
    onPageChange(page)

    // Scroll to top when changing pages
    window.scrollTo(0, 0)
  }

  /**
   * Determine if we have any active filters
   */
  const hasActiveFilters = () => {
    return !!(
      params.search ||
      params.category ||
      params.tag ||
      params.categories ||
      params.tags ||
      params.authors ||
      params.date_start ||
      params.date_end
    )
  }

  /**
   * Generate a descriptive title for filtered results
   */
  const getFilteredResultsTitle = () => {
    const filterParts = []

    if (params.search) {
      filterParts.push(`matching "${params.search}"`)
    }

    if (params.categories) {
      filterParts.push(`in selected categories`)
    } else if (params.category) {
      const category = categories.find(cat => String(cat.id) === params.category)
      filterParts.push(`in ${category?.name || 'selected category'}`)
    }

    if (params.tags) {
      filterParts.push(`with selected tags`)
    } else if (params.tag) {
      filterParts.push(`with selected tag`)
    }

    if (params.authors) {
      filterParts.push(`by selected authors`)
    }

    if (params.date_start || params.date_end) {
      if (params.date_start && params.date_end) {
        filterParts.push(`from ${params.date_start} to ${params.date_end}`)
      } else if (params.date_start) {
        filterParts.push(`from ${params.date_start}`)
      } else if (params.date_end) {
        filterParts.push(`until ${params.date_end}`)
      }
    }

    if (filterParts.length === 0) {
      return "All Posts"
    }

    return `Posts ${filterParts.join(" ")}`
  }

  return (
    <div className="w-full">
      {/* Page size and post count display */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="text-sm text-gray-600 font-medium">
          {posts.count > 0 ? (
            <>
              Showing {Math.min((currentPage - 1) * pageSize + 1, posts.count)} -{" "}
              {Math.min(currentPage * pageSize, posts.count)} of {posts.count} posts
            </>
          ) : (
            <>No posts found</>
          )}
        </div>

        {/* Page size selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show:</span>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="p-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            aria-label="Posts per page"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-gray-200 rounded-xl h-64"></div>
          ))}
        </div>
      ) : posts.results.length > 0 ? (
        <>
          {/* Post grid with filter title */}
          <div className="space-y-6">
            <div
              className="flex items-center opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="bg-primary/10 p-2 rounded-lg mr-3">
                {hasActiveFilters() ? (
                  <Search className="h-5 w-5 text-primary" />
                ) : (
                  <Dumbbell className="h-5 w-5 text-primary" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{getFilteredResultsTitle()}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.results.map((post, index) => (
                <React.Fragment key={post.id}>
                  {/* Ad after the third post */}
                  {index === 3 && <AdPlaceholder className="col-span-full h-32" />}
                  <PostCard post={post} index={index} />
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Pagination controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            pageSize={pageSize}
            nextPageUrl={posts.next}
            prevPageUrl={posts.previous}
          />
        </>
      ) : (
        // No posts found state
        <div
          className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm opacity-0 animate-[scaleIn_0.4s_ease-out_forwards]"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex justify-center mb-4">
            <div className="bg-gray-100 p-4 rounded-full">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-900">No posts found</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            We couldn't find any posts matching your criteria. Try adjusting your search or filter settings.
          </p>
        </div>
      )}
    </div>
  )
}
