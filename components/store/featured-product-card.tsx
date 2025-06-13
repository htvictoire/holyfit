"use client"

import { Star, Eye, Zap, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Product } from "@/types/store-types"

interface FeaturedProductCardProps {
  product: Product
  index: number
  on_view: () => void
  on_add_to_cart: () => void
}

export function FeaturedProductCard({ 
  product, 
  index, 
  on_view, 
  on_add_to_cart 
}: FeaturedProductCardProps) {
  const is_large = index === 0

  return (
    <div 
      className={`group relative overflow-hidden rounded-3xl bg-white/60 backdrop-blur-lg border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer ${
        is_large ? 'lg:col-span-2 lg:row-span-2' : ''
      }`}
      onClick={on_view}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 space-y-2">
          {product.original_price && (
            <Badge className="bg-red-500 text-white border-0 px-3 py-1 rounded-full font-bold">
              <Zap className="h-3 w-3 mr-1" />
              SALE
            </Badge>
          )}
          {!product.in_stock && (
            <Badge variant="secondary" className="border-0 px-3 py-1 rounded-full">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              on_view()
            }}
            className="bg-white/20 backdrop-blur-lg border border-white/30 hover:bg-white/30 text-white rounded-full p-3"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        {/* Floating Info */}
        <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 border border-white/30">
            <Badge variant="outline" className="text-white border-white/50 mb-2">
              {product.category.name}
            </Badge>
            <h3 className="font-bold text-white text-lg mb-2 line-clamp-1">
              {product.name}
            </h3>
            
            {product.rating && (
              <div className="flex items-center mb-3">
                <div className="flex items-center">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating!) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-white/30'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-white/80 text-sm ml-2">
                  ({product.review_count})
                </span>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-white">
                  ${product.price}
                </span>
                {product.original_price && (
                  <span className="text-lg text-white/60 line-through">
                    ${product.original_price}
                  </span>
                )}
              </div>
              
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  on_add_to_cart()
                }}
                disabled={!product.in_stock}
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 rounded-xl"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
