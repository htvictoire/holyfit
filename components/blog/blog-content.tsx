/**
 * Simplified blog content component that directly uses API endpoints for data
 */
"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Sidebar from "./sidebar"
import PostListing from "./post-listing"
import FilterBar from "./filter-bar"
import AdPlaceholder from "./ad-placeholder"
import type { BlogPostsResponse, CategoryItem, TagItem, AuthorItem, SelectOption } from "@/types/blog-types"
import { fetchPosts } from "@/services/blog-service"

interface BlogContentProps {
  /** Initial posts from server-side rendering */
  initialPosts: BlogPostsResponse
  /** Initial query parameters */
  initialParams: Record<string, string>
  /** All available categories */
  categories: CategoryItem[]
  /** All available tags */
  tags: TagItem[]
  /** All available authors */
  authors: AuthorItem[]
}

export default function BlogContent({
  initialPosts,
  initialParams,
  categories,
  tags,
  authors,
}: BlogContentProps) {
  // State for posts and loading
  const [posts, setPosts] = useState<BlogPostsResponse>(initialPosts)
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState<Record<string, string>>(initialParams)
  
  const router = useRouter()
  const pathname = usePathname()

  // Convert authors to SelectOption format for the filter bar
  const authorOptions: SelectOption[] = authors.map(author => ({
    value: author.id.toString(),
    label: author.name
  }))

  // Update URL and fetch posts when params change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Remove any undefined or null values before fetching
        const cleanParams = Object.fromEntries(
          Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '')
        );
        
        // Fetch posts with the cleaned params
        const data = await fetchPosts(cleanParams)
        setPosts(data)
        
        // Update URL with the current params - filter out any undefined values
        const queryParams = new URLSearchParams()
        Object.entries(cleanParams).forEach(([key, value]) => {
          if (value) queryParams.append(key, value)
        })
        
        const newUrl = `${pathname}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
        router.push(newUrl, { scroll: false })
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params, pathname, router])

  /**
   * Handle filter changes from sidebar
   */
  const handleSidebarFilterChange = (filterParams: Record<string, string>) => {
    // Validate the parameters before updating state
    const validParams = Object.entries(filterParams).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);
    
    // Reset page to 1 when filters change
    setParams({
      ...validParams,
      page: "1"
    })
  }

  /**
   * Handle filter changes from filter bar
   */
  const handleFilterChange = (filterParams: Record<string, string>) => {
    // Validate the parameters before updating state
    const validParams = Object.entries(filterParams).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);
    
    // Reset page to 1 when filters change
    setParams({
      ...validParams,
      page: "1"
    })
  }

  /**
   * Handle page change
   */
  const handlePageChange = (page: number) => {
    if (!page || isNaN(page)) {
      console.error("Invalid page number:", page);
      return;
    }
    
    setParams({
      ...params,
      page: page.toString()
    })
  }

  /**
   * Handle page size change
   */
  const handlePageSizeChange = (pageSize: number) => {
    if (!pageSize || isNaN(pageSize)) {
      console.error("Invalid page size:", pageSize);
      return;
    }
    
    setParams({
      ...params,
      size: pageSize.toString(),
      page: "1" // Reset to page 1
    })
  }

  return (
    <div className="space-y-6">
      {/* Enhanced filter bar */}
      <FilterBar
        onFilterChange={handleFilterChange}
        currentParams={params}
        categories={categories}
        tags={tags}
        authors={authorOptions}
      />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left sidebar */}
        <div className="w-full md:w-1/4">
          <Sidebar
            categories={categories}
            tags={tags}
            onFilterChange={handleSidebarFilterChange}
            currentCategory={params.category}
            currentTag={params.tag}
          />

          {/* Ad placeholder below sidebar */}
          <div className="mt-6">
            <AdPlaceholder className="h-64" />
          </div>
        </div>

        {/* Main content area */}
        <div className="w-full md:w-3/4">
          <PostListing
            posts={posts}
            loading={loading}
            params={params}
            categories={categories}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </div>
    </div>
  )
}
