/**
 * Simplified sidebar component that displays categories and tags from the API
 */
"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Dumbbell, Apple } from "lucide-react"
import type { CategoryItem, TagItem } from "@/types/blog-types"

interface SidebarProps {
  /** Categories fetched from API */
  categories: CategoryItem[]
  /** Tags fetched from API */
  tags: TagItem[]
  /** Function to call when a category or tag is clicked */
  onFilterChange: (params: Record<string, string>) => void
  /** Currently selected category */
  currentCategory?: string
  /** Currently selected tag */
  currentTag?: string
}

export default function Sidebar({
  categories,
  tags,
  onFilterChange,
  currentCategory,
  currentTag
}: SidebarProps) {
  // Track expanded categories and tags
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [expandedTags, setExpandedTags] = useState<Record<string, boolean>>({})

  /**
   * Toggle category expansion
   */
  const toggleCategory = (id: string, event: React.MouseEvent) => {
    if (!id) return;
    
    event.stopPropagation()
    setExpandedCategories(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  /**
   * Toggle tag expansion
   */
  const toggleTag = (id: string, event: React.MouseEvent) => {
    if (!id) return;
    
    event.stopPropagation()
    setExpandedTags(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  /**
   * Handle category selection
   */
  const handleCategoryClick = (categoryId: string) => {
    if (!categoryId) {
      console.error("Invalid category ID");
      return;
    }
    
    onFilterChange({
      category: categoryId,
      // Don't include undefined values
      page: "1" // Reset to page 1
    })
  }

  /**
   * Handle tag selection
   */
  const handleTagClick = (tagId: string) => {
    if (!tagId) {
      console.error("Invalid tag ID");
      return;
    }
    
    onFilterChange({
      tag: tagId,
      page: "1" // Reset to page 1
    })
  }

  /**
   * Render categories hierarchically
   */
  const renderCategories = (items: CategoryItem[], expanded: Record<string, boolean>, level = 0) => {
    if (!items || !Array.isArray(items)) return null;
    
    return items.map(category => {
      if (!category || !category.id) return null;
      
      const categoryId = String(category.id);
      const hasChildren = category.sub_categories && category.sub_categories.length > 0;
      const isExpanded = expanded[categoryId];
      const isActive = currentCategory === categoryId;

      return (
        <div key={categoryId} style={{ marginLeft: `${level * 16}px` }}>
          <div className="flex items-center py-2">
            {hasChildren ? (
              <button
                onClick={(e) => toggleCategory(categoryId, e)}
                className="mr-2 p-1 rounded-md hover:bg-gray-100 transition-colors"
                aria-label={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-primary" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-primary" />
                )}
              </button>
            ) : (
              <div className="w-6" />
            )}

            <button
              onClick={() => handleCategoryClick(categoryId)}
              className={`flex-1 transition-colors flex items-center justify-between text-left ${
                isActive ? "font-semibold text-primary" : "text-gray-700 hover:text-primary"
              }`}
            >
              <span>{category.name}</span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  isActive ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500"
                }`}
              >
                {category.post_count}
              </span>
            </button>
          </div>

          {hasChildren && isExpanded && (
            <div className={`ml-4 border-l border-gray-200 pl-2 overflow-hidden transition-all duration-300`}>
              {renderCategories(category.sub_categories!, expanded, level + 1)}
            </div>
          )}
        </div>
      )
    })
  }

  /**
   * Render tags hierarchically
   */
  const renderTags = (items: TagItem[], expanded: Record<string, boolean>, level = 0) => {
    if (!items || !Array.isArray(items)) return null;
    
    return items.map(tag => {
      if (!tag || !tag.id) return null;
      
      const tagId = String(tag.id);
      const hasChildren = tag.sub_tags && tag.sub_tags.length > 0;
      const isExpanded = expanded[tagId];
      const isActive = currentTag === tagId;

      return (
        <div key={tagId} style={{ marginLeft: `${level * 16}px` }}>
          <div className="flex items-center py-2">
            {hasChildren ? (
              <button
                onClick={(e) => toggleTag(tagId, e)}
                className="mr-2 p-1 rounded-md hover:bg-gray-100 transition-colors"
                aria-label={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-primary" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-primary" />
                )}
              </button>
            ) : (
              <div className="w-6" />
            )}

            <button
              onClick={() => handleTagClick(tagId)}
              className={`flex-1 transition-colors flex items-center justify-between text-left ${
                isActive ? "font-semibold text-primary" : "text-gray-700 hover:text-primary"
              }`}
            >
              <span>{tag.name}</span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  isActive ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500"
                }`}
              >
                {tag.post_count}
              </span>
            </button>
          </div>

          {hasChildren && isExpanded && (
            <div className={`ml-4 border-l border-gray-200 pl-2 overflow-hidden transition-all duration-300`}>
              {renderTags(tag.sub_tags!, expanded, level + 1)}
            </div>
          )}
        </div>
      )
    })
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-sm p-5 border border-gray-200">
      {/* Categories section */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="bg-primary/10 p-2 rounded-lg mr-3">
            <Dumbbell className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-bold text-lg text-gray-900">Categories</h3>
        </div>
        <div className="space-y-1">
          {renderCategories(categories, expandedCategories)}
        </div>
      </div>

      {/* Tags section */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center mb-4">
          <div className="bg-secondary/10 p-2 rounded-lg mr-3">
            <Apple className="h-5 w-5 text-secondary" />
          </div>
          <h3 className="font-bold text-lg text-gray-900">Tags</h3>
        </div>
        <div className="space-y-1">
          {renderTags(tags, expandedTags)}
        </div>
      </div>
    </div>
  )
}
