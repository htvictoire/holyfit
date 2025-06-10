/**
 * Utility functions for handling image URLs
 */

/**
 * Normalizes image URLs to handle both relative and absolute paths
 * @param url The image URL to normalize
 * @param fallback Optional fallback URL if the provided URL is invalid
 * @returns Normalized image URL
 */
export function normalizeImageUrl(url?: string, fallback = "/placeholder.svg"): string {
  if (!url) return fallback

  // Get the API URL from environment variables
  const apiUrl = process.env.NEXT_PUBLIC_ASSETS_URL || ''

  // If it's already an absolute URL, return it as is
  if (url.startsWith("http")) {
    return url
  }

  // Handle URLs with /media at the beginning (remove leading slash first)
  if (url.startsWith("/media/")) {
    const formattedApiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl
    return `${formattedApiUrl}${url}`
  }
  
  // Handle URLs with just media at the beginning (no leading slash)
  if (url.startsWith("media/")) {
    const formattedApiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl
    return `${formattedApiUrl}/${url}`
  }

  // If it's a relative URL starting with /, return it as is
  if (url.startsWith("/")) {
    return url
  }

  // Otherwise, add a leading / to make it a proper relative URL
  return `/${url}`
}
