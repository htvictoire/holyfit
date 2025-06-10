export interface Product {
    id: string
    name: string
    description: string
    price: number
    original_price?: number // For sale items
    image: string
    images?: string[] // Additional product images
    category: ProductCategory
    tags?: string[]
    in_stock: boolean
    stock_quantity?: number
    rating?: number
    review_count?: number
    features?: string[]
    specifications?: Record<string, string>
    variants?: ProductVariant[]
  }
  
  export interface ProductVariant {
    id: string
    name: string
    type: 'size' | 'color' | 'flavor' | 'weight'
    value: string
    price_modifier?: number // Additional cost for this variant
  }
  
  export interface ProductCategory {
    id: string
    name: string
    slug: string
    image?: string
    description?: string
  }
  
  export interface CartItem {
    id: string // Unique cart item ID
    product_id: string
    product: Product
    quantity: number
    selected_variants?: Record<string, string> // variant type -> selected value
    total_price: number
  }
  
  export interface Cart {
    items: CartItem[]
    total_items: number
    subtotal: number
    tax?: number
    shipping?: number
    total: number
  }
  
  export interface FilterState {
    category?: string
    price_range?: {
      min: number
      max: number
    }
    in_stock_only: boolean
    sort_by: 'name' | 'price-low' | 'price-high' | 'rating' | 'newest'
    search: string
  }
  
  export interface CheckoutForm {
    first_name: string
    last_name: string
    email: string
    phone: string
    address: string
    city: string
    zip_code: string
    notes?: string
  }
  
  export interface Order {
    id: string
    items: CartItem[]
    customer: CheckoutForm
    total: number
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered'
    created_at: Date
  }
