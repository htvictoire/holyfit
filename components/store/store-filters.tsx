"use client"

import { useState } from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { ProductCategory, FilterState } from "@/types/store-types"

interface StoreFiltersProps {
  filters: FilterState
  categories: ProductCategory[]
  price_range: number[]
  show_filters: boolean
  filtered_count: number
  in_stock_count: number
  on_sale_count: number
  on_filters_change: (filters: Partial<FilterState>) => void
  on_price_change: (range: number[]) => void
  on_toggle_filters: () => void
  on_view_mode_change: (mode: 'grid' | 'featured') => void
  view_mode: 'grid' | 'featured'
}

export function StoreFilters({
  filters,
  categories,
  price_range,
  show_filters,
  filtered_count,
  in_stock_count,
  on_sale_count,
  on_filters_change,
  on_price_change,
  on_toggle_filters,
  on_view_mode_change,
  view_mode
}: StoreFiltersProps) {
  return (
    <>
      {/* Search & Filter Bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 sm:gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
              <Input
                placeholder="Search for fitness gear..."
                value={filters.search}
                onChange={(e) => on_filters_change({ search: e.target.value })}
                className="pl-10 sm:pl-12 h-10 sm:h-12 border-0 bg-gray-100/80 backdrop-blur-sm rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all text-sm sm:text-base"
              />
            </div>
            
            {/* Filter Controls */}
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1">
              {/* Category Selector */}
              <Select
                value={filters.category || "all"}
                onValueChange={(value) => on_filters_change({ category: value === "all" ? undefined : value })}
              >
                <SelectTrigger className="h-10 sm:h-12 border-0 bg-gray-100/80 rounded-xl sm:rounded-2xl min-w-28 sm:min-w-40 flex-shrink-0">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-gray-100/80 rounded-xl sm:rounded-2xl p-0.5 sm:p-1 flex-shrink-0">
                <Button
                  variant={view_mode === 'featured' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => on_view_mode_change('featured')}
                  className="rounded-lg sm:rounded-xl text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 h-8 sm:h-10"
                >
                  Featured
                </Button>
                <Button
                  variant={view_mode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => on_view_mode_change('grid')}
                  className="rounded-lg sm:rounded-xl text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 h-8 sm:h-10"
                >
                  All Items
                </Button>
              </div>

              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={on_toggle_filters}
                className="lg:hidden h-10 sm:h-12 rounded-xl sm:rounded-2xl flex-shrink-0 px-3"
              >
                <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="ml-1 sm:ml-2 text-xs sm:text-sm">Filter</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Sidebar */}
      <div className={`lg:w-80 space-y-4 sm:space-y-6 ${show_filters ? 'block' : 'hidden lg:block'}`}>
        <div className="bg-white/60 backdrop-blur-lg rounded-2xl sm:rounded-3xl border border-gray-200/50 p-4 sm:p-6 shadow-xl">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Filters</h2>
          
          <div className="space-y-4 sm:space-y-6">
            {/* Price Range */}
            <div>
              <label className="text-sm font-semibold mb-2 sm:mb-3 block text-gray-700">
                Price Range: ${price_range[0]} - ${price_range[1]}
              </label>
              <div className="px-2 sm:px-3">
                <Slider
                  value={price_range}
                  onValueChange={on_price_change}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>

            {/* In Stock Only */}
            <div className="flex items-center space-x-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gray-50/50">
              <Checkbox
                id="in_stock"
                checked={filters.in_stock_only}
                onCheckedChange={(checked) => on_filters_change({ in_stock_only: !!checked })}
                className="rounded-lg"
              />
              <label htmlFor="in_stock" className="text-sm font-medium text-gray-700">
                In Stock Only
              </label>
            </div>

            {/* Sort By */}
            <div>
              <label className="text-sm font-semibold mb-2 sm:mb-3 block text-gray-700">Sort By</label>
              <Select
                value={filters.sort_by}
                onValueChange={(value: any) => on_filters_change({ sort_by: value })}
              >
                <SelectTrigger className="h-10 sm:h-12 border-0 bg-gray-50/50 rounded-xl sm:rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white">
          <h3 className="text-base sm:text-lg font-bold mb-2">Store Stats</h3>
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex justify-between text-sm sm:text-base">
              <span className="opacity-90">Products Found</span>
              <span className="font-bold">{filtered_count}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span className="opacity-90">In Stock</span>
              <span className="font-bold">{in_stock_count}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span className="opacity-90">On Sale</span>
              <span className="font-bold">{on_sale_count}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
