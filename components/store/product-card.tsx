"use client"

import { Star, Eye, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/types/store-types"

interface ProductCardProps {
  product: Product
  on_view: () => void
  on_add_to_cart: () => void
}

export function ProductCard({ product, on_view, on_add_to_cart }: ProductCardProps) {
  return (
    <div 
      className="group relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-lg border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
      onClick={on_view}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3">
          {product.original_price && (
            <Badge className="bg-gradient-to-r from-primary to-primary-dark text-white border-0 px-2 py-1 rounded-full text-xs font-bold">
              SALE
            </Badge>
          )}
        </div>

        {/* Quick View */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              on_view()
            }}
            className="bg-white/20 backdrop-blur-lg border border-white/30 hover:bg-white/30 text-white rounded-full p-2"
          >
            <Eye className="h-3 w-3" />
          </Button>
        </div>

        {!product.in_stock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Out of Stock
            </Badge>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-4">
        <Badge variant="outline" className="text-xs mb-2 bg-secondary/10 text-secondary border-secondary/20">
          {product.category.name}
        </Badge>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

        {product.rating && (
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating!) ? "text-accent fill-current" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 ml-2">({product.review_count})</span>
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">${product.price}</span>
            {product.original_price && (
              <span className="text-sm text-gray-500 line-through">${product.original_price}</span>
            )}
          </div>

          {product.in_stock && <span className="text-xs text-green-600 font-medium">In Stock</span>}
        </div>

        <Button
          onClick={(e) => {
            e.stopPropagation()
            on_add_to_cart()
          }}
          disabled={!product.in_stock}
          className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white rounded-xl"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  )
}
