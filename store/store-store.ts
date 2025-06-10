import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"
import type { Product, CartItem, Cart, FilterState, WishlistItem, ComparisonItem } from "@/types/store-types"
import { products } from "@/data/store-data"

interface StoreState {
  // Core Data
  products: Product[]
  filtered_products: Product[]
  featured_products: Product[]
  trending_products: Product[]

  // UI State
  filters: FilterState
  view_mode: "grid" | "list" | "masonry" | "compact"
  layout_mode: "featured" | "standard" | "curated"
  sort_by: "relevance" | "price-low" | "price-high" | "rating" | "newest" | "popularity"

  // Cart System
  cart: Cart
  is_cart_open: boolean
  cart_animation: boolean

  // Wishlist System
  wishlist: WishlistItem[]
  is_wishlist_open: boolean

  // Product Comparison
  comparison: ComparisonItem[]
  is_comparison_open: boolean

  // Modal System
  selected_product: Product | null
  quick_view_product: Product | null
  is_product_modal_open: boolean
  is_quick_view_open: boolean

  // Search & Discovery
  search_history: string[]
  recently_viewed: Product[]
  recommendations: Product[]

  // User Preferences
  user_preferences: {
    currency: "USD" | "EUR" | "GBP"
    language: "en" | "es" | "fr"
    theme: "light" | "dark" | "auto"
    notifications: boolean
  }

  // Analytics
  analytics: {
    page_views: number
    product_views: Record<string, number>
    search_queries: Record<string, number>
    cart_abandonment: number
  }

  // Actions
  set_filters: (filters: Partial<FilterState>) => void
  apply_filters: () => void
  clear_filters: () => void

  // Cart Actions
  add_to_cart: (product: Product, quantity?: number, variants?: Record<string, string>) => void
  remove_from_cart: (cart_item_id: string) => void
  update_cart_item_quantity: (cart_item_id: string, quantity: number) => void
  clear_cart: () => void
  apply_coupon: (code: string) => Promise<boolean>

  // Wishlist Actions
  add_to_wishlist: (product: Product) => void
  remove_from_wishlist: (product_id: string) => void
  move_to_cart: (product_id: string) => void

  // Comparison Actions
  add_to_comparison: (product: Product) => void
  remove_from_comparison: (product_id: string) => void
  clear_comparison: () => void

  // Modal Actions
  open_product_modal: (product: Product) => void
  close_product_modal: () => void
  open_quick_view: (product: Product) => void
  close_quick_view: () => void

  // UI Actions
  toggle_cart: () => void
  toggle_checkout: () => void
  toggle_wishlist: () => void
  toggle_comparison: () => void
  set_view_mode: (mode: "grid" | "list" | "masonry" | "compact") => void
  set_layout_mode: (mode: "featured" | "standard" | "curated") => void

  // Search Actions
  add_to_search_history: (query: string) => void
  add_to_recently_viewed: (product: Product) => void
  generate_recommendations: () => void

  // Analytics Actions
  track_product_view: (product_id: string) => void
  track_search: (query: string) => void
  track_cart_abandonment: () => void
}

const initial_filters: FilterState = {
  search: "",
  category: undefined,
  price_range: { min: 0, max: 1000 },
  in_stock_only: false,
  rating_min: 0,
  brands: [],
  tags: [],
  sort_by: "relevance",
}

const calculate_cart_totals = (
  items: CartItem[],
  coupon?: { code: string; discount: number },
): Omit<Cart, "items" | "coupon"> => {
  const subtotal = items.reduce((sum, item) => sum + item.total_price, 0)
  const discount = coupon ? (subtotal * coupon.discount) / 100 : 0
  const tax = (subtotal - discount) * 0.08
  const shipping = subtotal > 75 ? 0 : subtotal > 50 ? 4.99 : 9.99
  const total = subtotal - discount + tax + shipping

  return {
    total_items: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: Math.round(subtotal * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    total: Math.round(total * 100) / 100,
  }
}

export const useStoreState = create<StoreState>()(
  persist(
    immer((set, get) => ({
      // Initial State
      products,
      filtered_products: products,
      featured_products: products.filter((p) => p.rating && p.rating >= 4.5).slice(0, 8),
      trending_products: products.filter((p) => p.original_price).slice(0, 6),

      filters: initial_filters,
      view_mode: "grid",
      layout_mode: "featured",
      sort_by: "relevance",

      cart: {
        items: [],
        total_items: 0,
        subtotal: 0,
        discount: 0,
        tax: 0,
        shipping: 0,
        total: 0,
        coupon: null,
      },
      is_cart_open: false,
      cart_animation: false,
      is_checkout_open: false,

      wishlist: [],
      is_wishlist_open: false,

      comparison: [],
      is_comparison_open: false,

      selected_product: null,
      quick_view_product: null,
      is_product_modal_open: false,
      is_quick_view_open: false,

      search_history: [],
      recently_viewed: [],
      recommendations: [],

      user_preferences: {
        currency: "USD",
        language: "en",
        theme: "light",
        notifications: true,
      },

      analytics: {
        page_views: 0,
        product_views: {},
        search_queries: {},
        cart_abandonment: 0,
      },

      // Actions Implementation
      set_filters: (new_filters) => {
        set((state) => {
          Object.assign(state.filters, new_filters)
        })
        get().apply_filters()
      },

      apply_filters: () => {
        set((state) => {
          const { products, filters } = state
          let filtered = [...products]

          // Advanced search with fuzzy matching
          if (filters.search) {
            const search_terms = filters.search.toLowerCase().split(" ")
            filtered = filtered.filter((product) => {
              const searchable =
                `${product.name} ${product.description} ${product.category.name} ${product.tags?.join(" ") || ""}`.toLowerCase()
              return search_terms.every((term) => searchable.includes(term))
            })
          }

          // Category filtering
          if (filters.category) {
            filtered = filtered.filter((product) => product.category.id === filters.category)
          }

          // Price range filtering
          if (filters.price_range) {
            filtered = filtered.filter(
              (product) => product.price >= filters.price_range!.min && product.price <= filters.price_range!.max,
            )
          }

          // Stock filtering
          if (filters.in_stock_only) {
            filtered = filtered.filter((product) => product.in_stock)
          }

          // Rating filtering
          if (filters.rating_min && filters.rating_min > 0) {
            filtered = filtered.filter((product) => (product.rating || 0) >= filters.rating_min!)
          }

          // Brand filtering
          if (filters.brands && filters.brands.length > 0) {
            filtered = filtered.filter((product) => filters.brands!.includes(product.brand || ""))
          }

          // Tag filtering
          if (filters.tags && filters.tags.length > 0) {
            filtered = filtered.filter((product) => filters.tags!.some((tag) => product.tags?.includes(tag)))
          }

          // Advanced sorting
          filtered.sort((a, b) => {
            switch (state.sort_by) {
              case "price-low":
                return a.price - b.price
              case "price-high":
                return b.price - a.price
              case "rating":
                return (b.rating || 0) - (a.rating || 0)
              case "popularity":
                return (b.review_count || 0) - (a.review_count || 0)
              case "newest":
                return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
              case "relevance":
              default:
                // Relevance scoring based on multiple factors
                const score_a = (a.rating || 0) * 0.3 + (a.review_count || 0) * 0.2 + (a.in_stock ? 1 : 0) * 0.5
                const score_b = (b.rating || 0) * 0.3 + (b.review_count || 0) * 0.2 + (b.in_stock ? 1 : 0) * 0.5
                return score_b - score_a
            }
          })

          state.filtered_products = filtered
        })
      },

      clear_filters: () => {
        set((state) => {
          state.filters = { ...initial_filters }
          state.filtered_products = state.products
        })
      },

      add_to_cart: (product, quantity = 1, variants = {}) => {
        set((state) => {
          // Calculate price with variants
          let item_price = product.price
          if (variants && product.variants) {
            for (const [variant_type, selected_value] of Object.entries(variants)) {
              const variant = product.variants.find((v) => v.type === variant_type && v.value === selected_value)
              if (variant?.price_modifier) {
                item_price += variant.price_modifier
              }
            }
          }

          const variant_keys = Object.entries(variants)
            .sort()
            .map(([k, v]) => `${k}:${v}`)
            .join("|")
          const cart_item_id = `${product.id}${variant_keys ? `|${variant_keys}` : ""}`

          const existing_item_index = state.cart.items.findIndex((item) => item.id === cart_item_id)

          if (existing_item_index >= 0) {
            state.cart.items[existing_item_index].quantity += quantity
            state.cart.items[existing_item_index].total_price =
              Math.round(state.cart.items[existing_item_index].quantity * item_price * 100) / 100
          } else {
            const new_item: CartItem = {
              id: cart_item_id,
              product_id: product.id,
              product,
              quantity,
              selected_variants: variants,
              total_price: Math.round(quantity * item_price * 100) / 100,
            }
            state.cart.items.push(new_item)
          }

          const totals = calculate_cart_totals(state.cart.items, state.cart.coupon || undefined)
          Object.assign(state.cart, totals)

          // Trigger cart animation
          state.cart_animation = true
          setTimeout(() => {
            set((state) => {
              state.cart_animation = false
            })
          }, 1000)
        })
      },

      remove_from_cart: (cart_item_id) => {
        set((state) => {
          state.cart.items = state.cart.items.filter((item) => item.id !== cart_item_id)
          const totals = calculate_cart_totals(state.cart.items, state.cart.coupon || undefined)
          Object.assign(state.cart, totals)
        })
      },

      update_cart_item_quantity: (cart_item_id, quantity) => {
        if (quantity <= 0) {
          get().remove_from_cart(cart_item_id)
          return
        }

        set((state) => {
          const item = state.cart.items.find((item) => item.id === cart_item_id)
          if (item) {
            const unit_price = item.total_price / item.quantity
            item.quantity = quantity
            item.total_price = Math.round(quantity * unit_price * 100) / 100

            const totals = calculate_cart_totals(state.cart.items, state.cart.coupon || undefined)
            Object.assign(state.cart, totals)
          }
        })
      },

      clear_cart: () => {
        set((state) => {
          state.cart = {
            items: [],
            total_items: 0,
            subtotal: 0,
            discount: 0,
            tax: 0,
            shipping: 0,
            total: 0,
            coupon: null,
          }
        })
      },

      apply_coupon: async (code) => {
        // Simulate API call
        const valid_coupons = {
          SAVE10: { discount: 10, min_amount: 50 },
          SAVE20: { discount: 20, min_amount: 100 },
          WELCOME15: { discount: 15, min_amount: 0 },
        }

        const coupon = valid_coupons[code as keyof typeof valid_coupons]
        if (coupon && get().cart.subtotal >= coupon.min_amount) {
          set((state) => {
            state.cart.coupon = { code, discount: coupon.discount }
            const totals = calculate_cart_totals(state.cart.items, state.cart.coupon)
            Object.assign(state.cart, totals)
          })
          return true
        }
        return false
      },

      add_to_wishlist: (product) => {
        set((state) => {
          if (!state.wishlist.find((item) => item.product_id === product.id)) {
            state.wishlist.push({
              id: `wishlist_${product.id}_${Date.now()}`,
              product_id: product.id,
              product,
              added_at: new Date().toISOString(),
            })
          }
        })
      },

      remove_from_wishlist: (product_id) => {
        set((state) => {
          state.wishlist = state.wishlist.filter((item) => item.product_id !== product_id)
        })
      },

      move_to_cart: (product_id) => {
        const wishlist_item = get().wishlist.find((item) => item.product_id === product_id)
        if (wishlist_item) {
          get().add_to_cart(wishlist_item.product)
          get().remove_from_wishlist(product_id)
        }
      },

      add_to_comparison: (product) => {
        set((state) => {
          if (state.comparison.length < 4 && !state.comparison.find((item) => item.product_id === product.id)) {
            state.comparison.push({
              id: `comparison_${product.id}_${Date.now()}`,
              product_id: product.id,
              product,
              added_at: new Date().toISOString(),
            })
          }
        })
      },

      remove_from_comparison: (product_id) => {
        set((state) => {
          state.comparison = state.comparison.filter((item) => item.product_id !== product_id)
        })
      },

      clear_comparison: () => {
        set((state) => {
          state.comparison = []
        })
      },

      open_product_modal: (product) => {
        set((state) => {
          state.selected_product = product
          state.is_product_modal_open = true
        })
        get().track_product_view(product.id)
        get().add_to_recently_viewed(product)
      },

      close_product_modal: () => {
        set((state) => {
          state.selected_product = null
          state.is_product_modal_open = false
        })
      },

      open_quick_view: (product) => {
        set((state) => {
          state.quick_view_product = product
          state.is_quick_view_open = true
        })
        get().track_product_view(product.id)
      },

      close_quick_view: () => {
        set((state) => {
          state.quick_view_product = null
          state.is_quick_view_open = false
        })
      },

      toggle_cart: () => {
        set((state) => {
          state.is_cart_open = !state.is_cart_open
        })
      },

      toggle_checkout: () => {
        set((state) => {
          state.is_checkout_open = !state.is_checkout_open
        })
      },

      toggle_wishlist: () => {
        set((state) => {
          state.is_wishlist_open = !state.is_wishlist_open
        })
      },

      toggle_comparison: () => {
        set((state) => {
          state.is_comparison_open = !state.is_comparison_open
        })
      },

      set_view_mode: (mode) => {
        set((state) => {
          state.view_mode = mode
        })
      },

      set_layout_mode: (mode) => {
        set((state) => {
          state.layout_mode = mode
        })
      },

      add_to_search_history: (query) => {
        set((state) => {
          if (query.trim() && !state.search_history.includes(query)) {
            state.search_history.unshift(query)
            state.search_history = state.search_history.slice(0, 10)
          }
        })
        get().track_search(query)
      },

      add_to_recently_viewed: (product) => {
        set((state) => {
          state.recently_viewed = [product, ...state.recently_viewed.filter((p) => p.id !== product.id)].slice(0, 12)
        })
      },

      generate_recommendations: () => {
        set((state) => {
          // Simple recommendation algorithm based on recently viewed and cart items
          const viewed_categories = state.recently_viewed.map((p) => p.category.id)
          const cart_categories = state.cart.items.map((item) => item.product.category.id)
          const relevant_categories = [...new Set([...viewed_categories, ...cart_categories])]

          state.recommendations = state.products
            .filter((p) => relevant_categories.includes(p.category.id))
            .filter((p) => !state.recently_viewed.find((rv) => rv.id === p.id))
            .filter((p) => !state.cart.items.find((ci) => ci.product_id === p.id))
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 8)
        })
      },

      track_product_view: (product_id) => {
        set((state) => {
          state.analytics.product_views[product_id] = (state.analytics.product_views[product_id] || 0) + 1
        })
      },

      track_search: (query) => {
        set((state) => {
          state.analytics.search_queries[query] = (state.analytics.search_queries[query] || 0) + 1
        })
      },

      track_cart_abandonment: () => {
        set((state) => {
          state.analytics.cart_abandonment += 1
        })
      },
    })),
    {
      name: "holy-fit-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        recently_viewed: state.recently_viewed,
        search_history: state.search_history,
        user_preferences: state.user_preferences,
        analytics: state.analytics,
      }),
    },
  ),
)
