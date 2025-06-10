/**
 * Simplified filter bar component that directly uses API parameters
 */
"use client"

import { useState, useEffect } from "react"
import { Search, X, ArrowDownUp, Filter, Calendar, ChevronDown, Star, SlidersHorizontal, Tag, User } from "lucide-react"
import type { CategoryItem, TagItem, SelectOption } from "@/types/blog-types"

interface FilterBarProps {
  /** Function to call when filters change */
  onFilterChange: (params: Record<string, string>) => void
  /** Current API parameters */
  currentParams: Record<string, string>
  /** All available categories */
  categories: CategoryItem[]
  /** All available tags */
  tags: TagItem[]
  /** All available authors */
  authors: SelectOption[]
}

export default function FilterBar({ onFilterChange, currentParams, categories, tags, authors }: FilterBarProps) {
  // Local states for all filters
  const [searchTerm, setSearchTerm] = useState(currentParams.search || "")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    currentParams.categories ? currentParams.categories.split(',').filter(Boolean) : 
    currentParams.category ? [currentParams.category].filter(Boolean) : []
  )
  const [selectedTags, setSelectedTags] = useState<string[]>(
    currentParams.tags ? currentParams.tags.split(',').filter(Boolean) : 
    currentParams.tag ? [currentParams.tag].filter(Boolean) : []
  )
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>(
    currentParams.authors ? currentParams.authors.split(',').filter(Boolean) : []
  )
  const [dateStart, setDateStart] = useState(currentParams.date_start || "")
  const [dateEnd, setDateEnd] = useState(currentParams.date_end || "")

  // Update local state when props change (e.g., URL changes, direct navigation)
  useEffect(() => {
    setSearchTerm(currentParams.search || "")
    setSelectedCategories(
      currentParams.categories ? currentParams.categories.split(',').filter(Boolean) : 
      currentParams.category ? [currentParams.category].filter(Boolean) : []
    )
    setSelectedTags(
      currentParams.tags ? currentParams.tags.split(',').filter(Boolean) : 
      currentParams.tag ? [currentParams.tag].filter(Boolean) : []
    )
    setSelectedAuthors(
      currentParams.authors ? currentParams.authors.split(',').filter(Boolean) : []
    )
    setDateStart(currentParams.date_start || "")
    setDateEnd(currentParams.date_end || "")
  }, [currentParams])

  // Available sort options for the dropdown
  const sortOptions = [
    { label: "Date (Newest)", value: "-date" },
    { label: "Date (Oldest)", value: "date" },
    { label: "Title (A-Z)", value: "title" },
    { label: "Title (Z-A)", value: "-title" },
    { label: "Author (A-Z)", value: "author" },
    { label: "Author (Z-A)", value: "-author" },
  ]

  // Flatten categories and tags for selection
  const flattenedCategories = flattenItems(categories, "sub_categories") as SelectOption[]
  const flattenedTags = flattenItems(tags, "sub_tags") as SelectOption[]

  /**
   * Handle sort option change
   */
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ordering = e.target.value
    
    if (!ordering) {
      console.error("Invalid ordering value");
      return;
    }
    
    onFilterChange({
      ...currentParams,
      ordering,
      page: "1", // Reset to first page
    })
  }

  /**
   * Handle search form submission
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // Only include search if it's not empty
    const newParams = { ...currentParams };
    
    if (searchTerm && searchTerm.trim()) {
      newParams.search = searchTerm.trim();
    } else {
      delete newParams.search;
    }
    
    newParams.page = "1"; // Reset to first page
    
    onFilterChange(newParams);
  }

  /**
   * Clear search term
   */
  const clearSearch = () => {
    setSearchTerm("")

    // Create a new params object without the search parameter
    const newParams = { ...currentParams }
    delete newParams.search
    newParams.page = "1" // Reset to first page

    onFilterChange(newParams)
  }

  /**
   * Toggle advanced filters visibility
   */
  const toggleFilters = () => {
    setFiltersOpen(!filtersOpen)
  }

  /**
   * Apply all filters
   */
  const applyFilters = () => {
    // Start with current params and update with new filter values
    const newParams = { ...currentParams }
    
    // Handle categories
    if (selectedCategories.length > 0) {
      // Filter out any undefined or empty values
      const validCategories = selectedCategories.filter(Boolean);
      if (validCategories.length > 0) {
        newParams.categories = validCategories.join(',');
        delete newParams.category; // Remove single category if using multiple
      } else {
        delete newParams.categories;
      }
    } else {
      delete newParams.categories;
    }
    
    // Handle tags
    if (selectedTags.length > 0) {
      // Filter out any undefined or empty values
      const validTags = selectedTags.filter(Boolean);
      if (validTags.length > 0) {
        newParams.tags = validTags.join(',');
        delete newParams.tag; // Remove single tag if using multiple
      } else {
        delete newParams.tags;
      }
    } else {
      delete newParams.tags;
    }
    
    // Handle authors
    if (selectedAuthors.length > 0) {
      // Filter out any undefined or empty values
      const validAuthors = selectedAuthors.filter(Boolean);
      if (validAuthors.length > 0) {
        newParams.authors = validAuthors.join(',');
      } else {
        delete newParams.authors;
      }
    } else {
      delete newParams.authors;
    }
    
    // Handle date range
    if (dateStart) {
      newParams.date_start = dateStart;
    } else {
      delete newParams.date_start;
    }
    
    if (dateEnd) {
      newParams.date_end = dateEnd;
    } else {
      delete newParams.date_end;
    }
    
    // Reset to first page
    newParams.page = "1";

    onFilterChange(newParams);
    setFiltersOpen(false);
  }

  /**
   * Reset all filters
   */
  const resetFilters = () => {
    setSelectedCategories([])
    setSelectedTags([])
    setSelectedAuthors([])
    setDateStart("")
    setDateEnd("")

    // Keep only ordering and size parameters
    const newParams: Record<string, string> = {}
    
    if (currentParams.ordering) {
      newParams.ordering = currentParams.ordering
    }
    
    if (currentParams.size) {
      newParams.size = currentParams.size
    }
    
    // Reset to first page
    newParams.page = "1"

    onFilterChange(newParams)
  }

  /**
   * Toggle a category in the multi-select
   */
  const toggleCategory = (categoryId: string) => {
    if (!categoryId) return;
    
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  /**
   * Toggle a tag in the multi-select
   */
  const toggleTag = (tagId: string) => {
    if (!tagId) return;
    
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  /**
   * Toggle an author in the multi-select
   */
  const toggleAuthor = (authorId: string) => {
    if (!authorId) return;
    
    setSelectedAuthors((prev) => (prev.includes(authorId) ? prev.filter((id) => id !== authorId) : [...prev, authorId]))
  }

  /**
   * Helper function to count active filters
   */
  const getActiveFilterCount = () => {
    let count = 0
    if (selectedCategories.length) count++
    if (selectedTags.length) count++
    if (selectedAuthors.length) count++
    if (dateStart || dateEnd) count++
    return count
  }

  return (
    <div className="w-full">
      {/* Search and Sort controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 w-full">
        {/* Sort dropdown */}
        <div className="flex items-center">
          <div className="relative flex items-center border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <span className="flex items-center px-3 border-r border-gray-200 bg-gray-50">
              <ArrowDownUp className="h-4 w-4 text-primary" />
            </span>
            <select
              value={currentParams.ordering || "-date"}
              onChange={handleSortChange}
              className="p-2.5 bg-white appearance-none focus:outline-none pr-8 text-sm"
              aria-label="Sort posts"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="flex w-full md:w-auto">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2.5 pr-10 border border-gray-200 rounded-l-lg w-full focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm shadow-sm"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-primary text-white rounded-r-lg hover:bg-primary-dark transition-colors shadow-sm"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>

        {/* Filter toggle button */}
        <button
          className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-all shadow-sm ${
            getActiveFilterCount() > 0
              ? "bg-primary/10 border-primary/20 text-primary"
              : "border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
          onClick={toggleFilters}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="font-medium text-sm">Filters</span>
          {getActiveFilterCount() > 0 && (
            <span className="inline-flex items-center justify-center bg-primary text-white rounded-full w-5 h-5 text-xs">
              {getActiveFilterCount()}
            </span>
          )}
          <ChevronDown className={`h-4 w-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Advanced filters panel */}
      {filtersOpen && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm transition-all duration-300 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Categories multi-select */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <Filter className="h-4 w-4 mr-1.5 text-primary" />
                Categories
              </h3>
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2.5 bg-gray-50">
                {flattenedCategories.map((category) => (
                  <div key={category.value} className="flex items-center gap-2 py-1.5 px-1">
                    <input
                      type="checkbox"
                      id={`category-${category.value}`}
                      checked={selectedCategories.includes(category.value)}
                      onChange={() => toggleCategory(category.value)}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <label htmlFor={`category-${category.value}`} className="text-sm text-gray-700 cursor-pointer">
                      {category.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags multi-select */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <Tag className="h-4 w-4 mr-1.5 text-primary" />
                Tags
              </h3>
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2.5 bg-gray-50">
                {flattenedTags.map((tag) => (
                  <div key={tag.value} className="flex items-center gap-2 py-1.5 px-1">
                    <input
                      type="checkbox"
                      id={`tag-${tag.value}`}
                      checked={selectedTags.includes(tag.value)}
                      onChange={() => toggleTag(tag.value)}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <label htmlFor={`tag-${tag.value}`} className="text-sm text-gray-700 cursor-pointer">
                      {tag.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Authors multi-select */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <User className="h-4 w-4 mr-1.5 text-primary" />
                Authors
              </h3>
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2.5 bg-gray-50">
                {authors.map((author) => (
                  <div key={author.value} className="flex items-center gap-2 py-1.5 px-1">
                    <input
                      type="checkbox"
                      id={`author-${author.value}`}
                      checked={selectedAuthors.includes(author.value)}
                      onChange={() => toggleAuthor(author.value)}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <label htmlFor={`author-${author.value}`} className="text-sm text-gray-700 cursor-pointer">
                      {author.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Date range */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <Calendar className="h-4 w-4 mr-1.5 text-primary" />
                Date Range
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="date-start" className="text-xs text-gray-500 block mb-1">
                    From
                  </label>
                  <input
                    type="date"
                    id="date-start"
                    value={dateStart}
                    onChange={(e) => setDateStart(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="date-end" className="text-xs text-gray-500 block mb-1">
                    To
                  </label>
                  <input
                    type="date"
                    id="date-end"
                    value={dateEnd}
                    onChange={(e) => setDateEnd(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
            >
              Reset Filters
            </button>
            <button
              type="button"
              onClick={applyFilters}
              className="px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm font-medium transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Helper function to flatten hierarchical items for multi-select
 */
function flattenItems(items: any[], childrenKey: string, level = 0, result: SelectOption[] = []): SelectOption[] {
  if (!items || !Array.isArray(items)) return result;
  
  items.forEach((item) => {
    if (!item || !item.id) return;
    
    // Add current item with proper indentation for visual hierarchy
    const indent = level > 0 ? "—".repeat(level) + " " : ""
    result.push({
      value: String(item.id),
      label: `${indent}${item.name} ${item.post_count ? `(${item.post_count})` : ""}`,
    })

    // Process children if any
    if (item[childrenKey] && item[childrenKey].length > 0) {
      flattenItems(item[childrenKey], childrenKey, level + 1, result)
    }
  })

  return result
}
