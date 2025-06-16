"use client"

import { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useStoreState } from "@/store/store-store"
import {
  Search,
  ShoppingCart,
  Grid3X3,
  List,
  LayoutGrid,
  Filter,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  Award,
  Shield,
  Truck,
  RotateCcw,
  X,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { StoreHeader } from "@/components/store/store-header"
import { ProductCardAdvanced } from "@/components/store/product-card-advanced"
import { FeaturedProducts } from "@/components/store/featured-products"
import { CartModal } from "@/components/store/cart-modal"
import { CheckoutModalNew } from "@/components/store/checkout-modal-new"
import { ProductModalNew } from "@/components/store/product-modal-new"
import { EmptyState } from "@/components/store/empty-state"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/types/store-types"
import { fetchStoreData } from "@/services/store-service"

// Loading Components
const ProductCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
    </div>
  </div>
)

export default function StorePage() {
  const { 
    filtered_products, 
    filters, 
    cart, 
    selected_product, 
    is_product_modal_open,
    set_filters, 
    toggle_cart, 
    add_to_cart, 
    apply_filters,
    initialize_store,
    open_product_modal,
    close_product_modal 
  } = useStoreState()

  const [categories, setCategories] = useState<any[]>([])

  const { toast } = useToast()

  const [price_range, set_price_range] = useState([0, 1000])
  const [view_mode, set_view_mode] = useState<"grid" | "list">("grid")
  const [layout_mode, set_layout_mode] = useState<"featured" | "standard">("featured")
  const [show_filters, set_show_filters] = useState(false)
  const [loading, set_loading] = useState(true)
  const [filter_loading, set_filter_loading] = useState(false)
  const [show_search_modal, setShowSearchModal] = useState(false)

  // Initialize store
  useEffect(() => {
    const initializeAsync = async () => {
      try {
        console.log("Initializing store...")
        await initialize_store()
        const data = await fetchStoreData()
        console.log("Store data loaded:", data.products.length, "products")
        setCategories(data.categories)
        set_loading(false)
      } catch (error) {
        console.error("Failed to load store data:", error)
        set_loading(false)
      }
    }
    
    initializeAsync()
  }, [initialize_store])

  const handle_add_to_cart = (product: Product) => {
    console.log("Add to cart clicked for product:", product.name)
    
    if (!product.in_stock) {
      toast({
        title: "Out of Stock",
        description: `${product.name} is currently out of stock`,
        variant: "destructive",
      })
      return
    }

    if (product.variants && product.variants.length > 0) {
      console.log("Product has variants, opening modal")
      open_product_modal(product)
    } else {
      console.log("Adding product to cart directly")
      try {
        add_to_cart(product)
        toast({
          title: "Added to Cart! 🎉",
          description: `${product.name} has been added to your cart`,
          duration: 3000,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add item to cart. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handle_view_product = (product: Product) => {
    console.log("View product clicked for:", product.name)
    open_product_modal(product)
  }

  const handle_close_modal = () => {
    close_product_modal()
  }

  const handle_search_change = (value: string) => {
    try {
      set_filters({ search: value })
      // Auto-switch to 'all' mode and list view when search is active
      if (value.trim() && layout_mode === "featured") {
        set_layout_mode("standard")
        set_view_mode("list")
      }
      
      // Show toast when search returns no results after user has typed something
      if (value.trim() && filtered_products.length === 0) {
        setTimeout(() => {
          if (filtered_products.length === 0) {
            toast({
              title: "No Results Found",
              description: `No products found for "${value}". Try different keywords.`,
              variant: "destructive",
              duration: 3000,
            })
          }
        }, 500) // Small delay to allow filtering to complete
      }
    } catch (error) {
      toast({
        title: "Search Error",
        description: "Failed to perform search. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handle_price_range_change = (value: number[]) => {
    set_price_range(value)
    set_filter_loading(true)

    const timer = setTimeout(() => {
      set_filters({
        price_range: {
          min: value[0],
          max: value[1],
        },
      })
      set_filter_loading(false)
    }, 500)

    return () => clearTimeout(timer)
  }

  const handle_clear_filters = () => {
    try {
      set_filters({
        search: "",
        category: undefined,
        in_stock_only: false,
        price_range: undefined,
      })
      set_price_range([0, 1000])
      toast({
        title: "Filters Cleared ✨",
        description: "All filters have been reset",
        duration: 2000,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear filters. Please try again.",
        variant: "destructive",
      })
    }
  }

  const stats = useMemo(
    () => ({
      filtered_count: filtered_products.length,
      in_stock_count: filtered_products.filter((p) => p.in_stock).length,
      on_sale_count: filtered_products.filter((p) => p.original_price).length,
      avg_rating: filtered_products.reduce((sum, p) => sum + (p.rating || 0), 0) / filtered_products.length || 0,
    }),
    [filtered_products],
  )

  const layout_classes = {
    grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8",
    list: "flex flex-col gap-6",
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <StoreHeader total_items={0} total_amount={0} on_cart_click={() => {}} />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <StoreHeader total_items={Number(cart.total_items) || 0} total_amount={Number(cart.total) || 0} on_cart_click={toggle_cart} />

      {/* Advanced Search & Filter Bar */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Mobile Layout */}
          <div className="lg:hidden">
            {/* Mobile Header - Single Row */}
            <div className="flex items-center justify-center gap-2 px-2">
              {!show_search_modal ? (
                <>
                  {/* Search Icon */}
                  <Button
                    variant="outline"
                    onClick={() => setShowSearchModal(true)}
                    className="h-12 px-4 border-gray-300 hover:bg-gray-50 rounded-xl flex-shrink-0"
                  >
                    <Search className="w-5 h-5 text-gray-400" />
                  </Button>

                  {/* Filters Button */}
                  <Button
                    variant="outline"
                    onClick={() => set_show_filters(!show_filters)}
                    className="h-12 px-3 border-gray-300 hover:bg-gray-50 rounded-xl flex-shrink-0"
                  >
                    <SlidersHorizontal className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">Filters</span>
                    {Object.values(filters).some(
                      (v) => v && v !== "" && JSON.stringify(v) !== JSON.stringify({ min: 0, max: 1000 }),
                    ) && (
                      <Badge className="ml-2 bg-purple-600 text-white flex-shrink-0 text-xs">
                        {
                          Object.values(filters).filter(
                            (v) => v && v !== "" && JSON.stringify(v) !== JSON.stringify({ min: 0, max: 1000 }),
                          ).length
                        }
                      </Badge>
                    )}
                  </Button>

                  {/* Cart Button - Takes remaining space */}
                  <Button
                    onClick={toggle_cart}
                    className="relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12 px-4 rounded-xl shadow-lg flex-1 max-w-[180px]"
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <div className="relative flex-shrink-0">
                        <ShoppingCart className="w-5 h-5" />
                        {cart.total_items > 0 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                          >
                            {cart.total_items}
                          </motion.div>
                        )}
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold">${(Number(cart.total) || 0).toFixed(2)}</div>
                        <div className="text-xs opacity-90">{Number(cart.total_items) || 0} items</div>
                      </div>
                    </div>
                  </Button>
                </>
              ) : (
                <>
                  {/* Inline Search Mode */}
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Search fitness products..."
                      value={filters.search}
                      onChange={(e) => handle_search_change(e.target.value)}
                      className={`pl-12 pr-4 h-12 focus:border-purple-500 focus:ring-purple-500 rounded-xl text-base shadow-sm w-full ${
                        filters.search && filtered_products.length === 0 
                          ? 'border-red-500 border-2' 
                          : 'border-gray-300'
                      }`}
                      autoFocus
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowSearchModal(false)}
                    className="h-12 px-4 border-gray-300 hover:bg-gray-50 rounded-xl flex-shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Advanced Search */}
            <div className="flex-1 relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search 10,000+ premium fitness products..."
                  value={filters.search}
                  onChange={(e) => handle_search_change(e.target.value)}
                  className="pl-12 pr-12 h-14 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-2xl text-lg shadow-sm"
                />
                {filters.search && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handle_search_change("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Layout Mode Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-2xl p-1">
                <Button
                  variant={layout_mode === "featured" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => set_layout_mode("featured")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl"
                >
                  <Sparkles className="w-4 h-4" />
                  Featured
                </Button>
                <Button
                  variant={layout_mode === "standard" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => set_layout_mode("standard")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl"
                >
                  <LayoutGrid className="w-4 h-4" />
                  All
                </Button>
              </div>

              {/* Category Filter */}
              <Select
                value={filters.category || "all"}
                onValueChange={(value) => {
                  set_filters({ category: value === "all" ? undefined : value })
                  // Auto-switch to 'all' mode and list view when category filter is active
                  if (value !== "all" && layout_mode === "featured") {
                    set_layout_mode("standard")
                    set_view_mode("list")
                  }
                }}
              >
                <SelectTrigger className="h-12 min-w-48 border-gray-300 rounded-xl bg-white">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <span>{category.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {filtered_products.filter((p) => p.category.id === category.id).length}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                <Button
                  variant={view_mode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => set_view_mode("grid")}
                  className="w-10 h-10 p-0 rounded-lg"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={view_mode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => set_view_mode("list")}
                  className="w-10 h-10 p-0 rounded-lg"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => set_show_filters(!show_filters)}
                  className="h-12 px-4 border-gray-300 hover:bg-gray-50 rounded-xl"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                  {Object.values(filters).some(
                    (v) => v && v !== "" && JSON.stringify(v) !== JSON.stringify({ min: 0, max: 1000 }),
                  ) && (
                    <Badge className="ml-2 bg-purple-600 text-white">
                      {
                        Object.values(filters).filter(
                          (v) => v && v !== "" && JSON.stringify(v) !== JSON.stringify({ min: 0, max: 1000 }),
                        ).length
                      }
                    </Badge>
                  )}
                </Button>

                {/* Cart Button */}
                <Button
                  onClick={toggle_cart}
                  className="relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12 px-6 rounded-xl shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <ShoppingCart className="w-5 h-5" />
                      {cart.total_items > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                        >
                          {cart.total_items}
                        </motion.div>
                      )}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold">${(Number(cart.total) || 0).toFixed(2)}</div>
                      <div className="text-xs opacity-90">{Number(cart.total_items) || 0} items</div>
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Advanced Sidebar */}
          <AnimatePresence>
            {show_filters && (
              <>
                {/* Mobile Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => set_show_filters(false)}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                />
                
                {/* Sidebar */}
                <motion.div
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  className="w-80 flex-shrink-0 lg:relative fixed top-0 left-0 h-full bg-white z-50 lg:z-auto lg:h-auto overflow-y-auto"
                >
                <div className="lg:sticky lg:top-32 p-4 lg:p-0 space-y-4">
                  {/* Mobile Close Button */}
                  <div className="lg:hidden flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center">
                      <Filter className="w-5 h-5 mr-2 text-purple-600" />
                      Filters & Insights
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => set_show_filters(false)}
                      className="w-8 h-8 p-0 rounded-full hover:bg-gray-100"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Mobile Only: Category Selector */}
                  <div className="lg:hidden">
                    <label className="text-sm font-semibold mb-2 block text-gray-700">
                      Category
                    </label>
                    <Select
                      value={filters.category || "all"}
                      onValueChange={(value) => {
                        set_filters({ category: value === "all" ? undefined : value })
                        if (value !== "all" && layout_mode === "featured") {
                          set_layout_mode("standard")
                          set_view_mode("list")
                        }
                      }}
                    >
                      <SelectTrigger className="h-10 border-gray-300 rounded-lg bg-white">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Mobile Only: Layout Mode Toggle */}
                  <div className="lg:hidden">
                    <label className="text-sm font-semibold mb-2 block text-gray-700">
                      Layout Mode
                    </label>
                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                      <Button
                        variant={layout_mode === "featured" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => set_layout_mode("featured")}
                        className="flex-1 rounded-md h-8 text-xs"
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        Featured
                      </Button>
                      <Button
                        variant={layout_mode === "standard" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => set_layout_mode("standard")}
                        className="flex-1 rounded-md h-8 text-xs"
                      >
                        <LayoutGrid className="w-3 h-3 mr-1" />
                        All
                      </Button>
                    </div>
                  </div>

                  {/* Mobile Only: View Mode Toggle */}
                  <div className="lg:hidden">
                    <label className="text-sm font-semibold mb-2 block text-gray-700">
                      View Mode
                    </label>
                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                      <Button
                        variant={view_mode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => set_view_mode("grid")}
                        className="flex-1 rounded-md h-8 text-xs"
                      >
                        <LayoutGrid className="w-3 h-3 mr-1" />
                        Grid
                      </Button>
                      <Button
                        variant={view_mode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => set_view_mode("list")}
                        className="flex-1 rounded-md h-8 text-xs"
                      >
                        <List className="w-3 h-3 mr-1" />
                        List
                      </Button>
                    </div>
                  </div>

                  <div className="lg:hidden border-t border-gray-200 pt-3"></div>

                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-semibold mb-2 block text-gray-700">
                      Price Range: ${price_range[0]} - ${price_range[1]}
                    </label>
                    <div className="px-2 mb-2">
                      <Slider
                        value={price_range}
                        onValueChange={handle_price_range_change}
                        max={1000}
                        step={10}
                        className="w-full"
                      />
                    </div>
                    {filter_loading && <Progress value={66} className="h-1" />}
                  </div>

                  {/* Stock Filter */}
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <label htmlFor="in_stock" className="text-sm font-semibold text-gray-700">
                      Show In Stock Only
                    </label>
                    <Checkbox
                      id="in_stock"
                      checked={filters.in_stock_only}
                      onCheckedChange={(checked) => {
                        set_filters({ in_stock_only: !!checked })
                        if (checked && layout_mode === "featured") {
                          set_layout_mode("standard")
                          set_view_mode("list")
                        }
                      }}
                    />
                  </div>

                  <Button
                    variant="outline"
                    onClick={handle_clear_filters}
                    className="w-full border-gray-300 hover:bg-gray-50 rounded-lg h-10 text-sm"
                  >
                    Clear All Filters
                  </Button>

                  <div className="border-t border-gray-200 pt-3"></div>

                  {/* Store Statistics */}
                  <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 text-white rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      <h3 className="font-bold text-sm">Store Insights</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <div className="text-lg font-bold">{stats.filtered_count}</div>
                        <div className="text-xs opacity-90">Products</div>
                      </div>
                      <div className="text-center p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <div className="text-lg font-bold text-green-300">{stats.in_stock_count}</div>
                        <div className="text-xs opacity-90">In Stock</div>
                      </div>
                      <div className="text-center p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <div className="text-lg font-bold text-yellow-300">{stats.on_sale_count}</div>
                        <div className="text-xs opacity-90">On Sale</div>
                      </div>
                      <div className="text-center p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <div className="text-lg font-bold">{stats.avg_rating.toFixed(1)}</div>
                        <div className="text-xs opacity-90">Avg Rating</div>
                      </div>
                    </div>
                  </div>
                </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1">
            {filtered_products.length === 0 ? (
              <EmptyState on_clear_filters={handle_clear_filters} />
            ) : (
              <div className="space-y-16">
                {/* Featured Products Section */}
                {layout_mode === "featured" && <FeaturedProducts products={filtered_products} />}

                {/* Main Products Section */}
                <motion.section
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 mb-3 px-4 py-2">
                        {layout_mode === "featured" ? "MORE PRODUCTS" : "ALL PRODUCTS"}
                      </Badge>
                      <h2 className="text-3xl font-bold text-gray-800">
                        {layout_mode === "featured" ? "Complete Collection" : "Browse All Products"}
                      </h2>
                      <p className="text-gray-600 mt-2 text-lg">
                        {`${filtered_products.length} premium products available`}
                      </p>
                    </div>
                  </div>

                  {/* Main Products Section */}
                  <div className={layout_classes[view_mode]}>
                    {console.log("Rendering products:", filtered_products.length)}
                    {(() => {
                      let products_to_render = filtered_products;
                      
                      // For featured layout, reorder products: non-featured first, then featured at the end
                      if (layout_mode === "featured") {
                        const featured_products = filtered_products.filter(p => p.rating && p.rating >= 4.5);
                        const non_featured_products = filtered_products.filter(p => !p.rating || p.rating < 4.5);
                        products_to_render = [...non_featured_products, ...featured_products];
                      }

                      return products_to_render.map((product, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={view_mode === "grid" ? "h-full" : ""}
                        >
                          <ProductCardAdvanced
                            product={product}
                            variant={view_mode === "list" ? "list" : "default"}
                            on_view={() => handle_view_product(product)}
                            on_add_to_cart={() => handle_add_to_cart(product)}
                            className={view_mode === "grid" ? "h-full" : ""}
                          />
                        </motion.div>
                      ));
                    })()}
                  </div>
                </motion.section>

                {/* Trust Indicators */}
                <motion.section
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-12"
                >
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Holy Fit?</h2>
                    <p className="text-xl text-gray-600">Your trusted partner in fitness excellence</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="text-center">
                      <div className="bg-blue-600 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <Truck className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Free Shipping</h3>
                      <p className="text-gray-600">Free delivery on orders over $75</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-green-600 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <Shield className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Secure Payment</h3>
                      <p className="text-gray-600">256-bit SSL encryption protection</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-orange-600 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <RotateCcw className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Easy Returns</h3>
                      <p className="text-gray-600">30-day hassle-free returns</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-purple-600 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Premium Quality</h3>
                      <p className="text-gray-600">Certified fitness equipment</p>
                    </div>
                  </div>
                </motion.section>

                {/* Footer Section */}
                {/* <motion.footer
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="bg-gray-900 text-white rounded-3xl p-12 mt-16"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div>
                      <h3 className="text-xl font-bold mb-4">Holy Fit</h3>
                      <p className="text-gray-300 mb-4">
                        Your trusted partner in fitness excellence. Premium equipment and supplements for your fitness
                        journey.
                      </p>
                      <div className="flex space-x-4">
                        <Button variant="ghost" size="sm" className="text-white hover:text-purple-400">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                          </svg>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-white hover:text-purple-400">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                          </svg>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-white hover:text-purple-400">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
                          </svg>
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                      <ul className="space-y-2 text-gray-300">
                        <li>
                          <a href="#" className="hover:text-white transition-colors">
                            Home
                          </a>
                        </li>
                        <li>
                          <a href="#" className="hover:text-white transition-colors">
                            About Us
                          </a>
                        </li>
                        <li>
                          <a href="#" className="hover:text-white transition-colors">
                            Services
                          </a>
                        </li>
                        <li>
                          <a href="#" className="hover:text-white transition-colors">
                            Blog
                          </a>
                        </li>
                        <li>
                          <a href="#" className="hover:text-white transition-colors">
                            Contact
                          </a>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold mb-4">Categories</h4>
                      <ul className="space-y-2 text-gray-300">
                        <li>
                          <a href="#" className="hover:text-white transition-colors">
                            Equipment
                          </a>
                        </li>
                        <li>
                          <a href="#" className="hover:text-white transition-colors">
                            Supplements
                          </a>
                        </li>
                        <li>
                          <a href="#" className="hover:text-white transition-colors">
                            Apparel
                          </a>
                        </li>
                        <li>
                          <a href="#" className="hover:text-white transition-colors">
                            Accessories
                          </a>
                        </li>
                        <li>
                          <a href="#" className="hover:text-white transition-colors">
                            Nutrition
                          </a>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
                      <div className="space-y-2 text-gray-300">
                        <p className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          +1 (555) 123-4567
                        </p>
                        <p className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          info@holyfit.com
                        </p>
                        <p className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          123 Fitness St, Gym City
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2024 Holy Fit. All rights reserved. | Privacy Policy | Terms of Service</p>
                  </div>
                </motion.footer> */}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* WhatsApp Checkout Button */}
      {/* <div className="fixed bottom-8 right-8 z-50">
        <Button
          onClick={() => {
            if (cart.items.length === 0) {
              toast({
                title: "Your cart is empty",
                description: "Add some products to your cart first",
                variant: "destructive",
              })
              return
            }

            // Format cart items for WhatsApp
            const cartText = cart.items
              .map((item) => `• ${item.quantity}x ${item.product.name} - $${item.total_price.toFixed(2)}`)
              .join("%0A")

            const totalText = `%0A%0A*Total: $${cart.total.toFixed(2)}*`
            const message = `*My Holy Fit Order:*%0A%0A${cartText}${totalText}%0A%0APlease process my order. Thank you!`

            // Open WhatsApp with pre-filled message
            const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
            window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank")
          }}
          className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-2xl flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="white"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
            <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
            <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
            <path d="M9.5 13.5c.5 1 1.5 1 2.5 1s2-.5 2.5-1" />
          </svg>
          Checkout via WhatsApp
        </Button>
      </div> */}


      {/* Modals */}
      <CartModal />
      <CheckoutModalNew />

      {selected_product && (
        <ProductModalNew product={selected_product} is_open={is_product_modal_open} on_close={handle_close_modal} />
      )}
    </div>
  )
}
