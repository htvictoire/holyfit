/**
 * Type definitions for the blog module
 */

/**
 * Category object with ID and name
 */
export interface CategoryObject {
  id: string | number;
  name: string;
}

/**
 * Tag object with ID and name
 */
export interface TagObject {
  id: string | number;
  name: string;
}

/**
 * Author object with ID and name
 */
export interface AuthorObject {
  id: string | number;
  name: string;
}

/**
 * Blog post structure returned from the API
 */
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  image: string;
  date: string;
  author?: string | null;
  author_id?: string | number;
  category: CategoryObject;
  tags: TagObject[];
  excerpt?: string;
  popularity?: number;
}

/**
 * API response for paginated blog posts
 */
export interface BlogPostsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BlogPost[];
}

/**
 * Category item with post count and subcategories
 */
export interface CategoryItem {
  id: string | number;
  name: string;
  post_count: number;
  sub_categories?: CategoryItem[];
}

/**
 * Tag item with post count and subtags
 */
export interface TagItem {
  id: string | number;
  name: string;
  post_count: number;
  sub_tags?: TagItem[];
}

/**
 * Author item for filtering
 */
export interface AuthorItem {
  id: string | number;
  name: string;
  post_count?: number;
}

/**
 * Date range for filtering posts
 */
export interface DateRange {
  start?: string;
  end?: string;
}

/**
 * Popularity range for filtering posts
 */
export interface PopularityRange {
  min?: number;
  max?: number;
}

/**
 * Enhanced filter state for controlling blog post listing
 * with multi-select options for categories, tags, authors,
 * date range, and popularity range
 */
export interface FilterState {
  sort_by: string;
  order: "asc" | "desc";
  category?: string;
  tag?: string;
  categories?: string[];
  tags?: string[];
  authors?: string[];
  search?: string;
  date_range?: DateRange;
  popularity_range?: PopularityRange;
  page: number;
}

/**
 * Sort option structure for dropdown menu
 */
export interface SortOption {
  label: string;
  value: string;
}

/**
 * Posts grouped by category for display
 */
export interface GroupedPosts {
  category: CategoryItem;
  posts: BlogPost[];
}

/**
 * Common select option interface for dropdown menus
 */
export interface SelectOption {
  value: string;
  label: string;
}
