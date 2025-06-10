/**
 * Blog service for fetching blog data from the API
 */
import type { BlogPostsResponse, CategoryItem, TagItem, AuthorItem } from "@/types/blog-types";

// API base URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003/api/v1';

/**
 * Fetch blog posts with optional filters and pagination
 */
export async function fetchPosts(params: Record<string, string> = {}): Promise<BlogPostsResponse> {
  try {
    // Filter out undefined, null, or empty values
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });

    const response = await fetch(`${API_URL}/blog/posts/?${queryParams.toString()}`, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

/**
 * Fetch categories directly from the API
 */
export async function fetchCategories(): Promise<CategoryItem[]> {
  try {
    const response = await fetch(`${API_URL}/blog/categories/`, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results || data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

/**
 * Fetch tags directly from the API
 */
export async function fetchTags(): Promise<TagItem[]> {
  try {
    const response = await fetch(`${API_URL}/blog/tags/`, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results || data;
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw error;
  }
}

/**
 * Fetch authors directly from the API
 */
export async function fetchAuthors(): Promise<AuthorItem[]> {
  try {
    const response = await fetch(`${API_URL}/blog/authors/`, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results || data;
  } catch (error) {
    console.error("Error fetching authors:", error);
    throw error;
  }
}

/**
 * Fetch a single post by its slug - only used on detail pages
 * @param slug The post slug to fetch
 * @returns The post data or null if not found
 */
export async function fetchPostBySlug(slug: string): Promise<any> {
  // Only call this function from the detail page with validated slugs
  const url = `${API_URL}/blog/posts/s/${slug}/`;
  
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store"
    });

    if (!response.ok) {
      console.error(`API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    return null;
  }
}
