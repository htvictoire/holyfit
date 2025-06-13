"use client"

import { Badge } from "@/components/ui/badge"
import { ProductCardAdvanced } from "@/components/store/product-card-advanced"
import { useStoreState } from "@/store/store-store"
import type { Product } from "@/types/store-types"

interface FeaturedProductsProps {
  products: Product[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const { add_to_cart, open_product_modal } = useStoreState()

  const featured_products = products.filter((p) => p.rating && p.rating >= 4.5).slice(0, 9)

  if (featured_products.length === 0) return null

  const handle_view_product = (product: Product) => {
    console.log("Featured product view clicked:", product.name)
    open_product_modal(product)
  }

  const handle_add_to_cart = (product: Product) => {
    console.log("Featured product add to cart clicked:", product.name)
    if (product.variants && product.variants.length > 0) {
      open_product_modal(product)
    } else {
      add_to_cart(product)
    }
  }

  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 mb-4 px-6 py-3 text-lg font-bold">
          ⭐ FEATURED COLLECTION
        </Badge>
        <h2 className="text-5xl font-black text-gray-800 mb-6">
          Elite Fitness
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {" "}
            Essentials
          </span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Discover our most popular and highest-rated fitness equipment, handpicked by our experts and loved by
          thousands of customers
        </p>
      </div>

      {/* Dynamic Masonry Layout - Zero Empty Spaces */}
      <div className="mb-12">
        {/* First Row - Hero + 2 Side Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <ProductCardAdvanced
              product={featured_products[0]}
              variant="hero"
              on_view={() => handle_view_product(featured_products[0])}
              on_add_to_cart={() => handle_add_to_cart(featured_products[0])}
              className="h-full"
            />
          </div>
          <div className="flex flex-col gap-6">
            {featured_products.slice(1, 3).map((product) => (
              <ProductCardAdvanced
                key={product.id}
                product={product}
                variant="featured"
                on_view={() => handle_view_product(product)}
                on_add_to_cart={() => handle_add_to_cart(product)}
                className="flex-1"
              />
            ))}
          </div>
        </div>

        {/* Second Row - 3 Equal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured_products.slice(3, 6).map((product) => (
            <ProductCardAdvanced
              key={product.id}
              product={product}
              variant="featured"
              on_view={() => handle_view_product(product)}
              on_add_to_cart={() => handle_add_to_cart(product)}
              className="h-full"
            />
          ))}
        </div>
      </div>

      {/* Final Row - 3 Premium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {featured_products.slice(6, 9).map((product) => (
          <ProductCardAdvanced
            key={product.id}
            product={product}
            variant="featured"
            on_view={() => handle_view_product(product)}
            on_add_to_cart={() => handle_add_to_cart(product)}
            className="h-full"
          />
        ))}
      </div>
    </section>
  )
}
