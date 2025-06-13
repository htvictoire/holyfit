"use client"

import { useState } from "react"
import { Star, ShoppingCart, Eye, Heart, Zap, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Product } from "@/types/store-types"

interface ProductCardAdvancedProps {
  product: Product
  variant?: "default" | "featured" | "compact" | "hero" | "list"
  on_view: () => void
  on_add_to_cart: () => void
  className?: string
}

export function ProductCardAdvanced({
  product,
  variant = "default",
  on_view,
  on_add_to_cart,
  className,
}: ProductCardAdvancedProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0

  if (variant === "hero") {
    return (
      <Card
        className={cn(
          "group relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 cursor-pointer",
          className,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={on_view}
      >
        <CardContent className="p-0 relative h-[500px]">
          <div className="absolute inset-0">
            <img
              src={product.image || "/placeholder.svg?height=500&width=800"}
              alt={product.name}
              className={cn(
                "w-full h-full object-cover transition-all duration-1000",
                isHovered ? "scale-110 brightness-75" : "scale-100 brightness-50",
              )}
              onLoad={() => setImageLoaded(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          </div>

          {/* Floating Elements */}
          <div className="absolute top-6 left-6 flex flex-col gap-3">
            <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg animate-pulse">
              <Zap className="w-3 h-3 mr-1" />
              BESTSELLER
            </Badge>
            {discount > 0 && (
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
                -{discount}% OFF
              </Badge>
            )}
          </div>

          <div className="absolute top-6 right-6 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                on_view()
              }}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white shadow-xl"
            >
              <Eye className="w-5 h-5" />
            </Button>
            <Button
              size="sm"
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white shadow-xl"
            >
              <Heart className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="text-white space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-white border-white/30 bg-white/10 backdrop-blur-sm">
                  {product.category.name}
                </Badge>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i < Math.floor(product.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-400",
                      )}
                    />
                  ))}
                  <span className="text-sm text-white/80 ml-1">({product.review_count})</span>
                </div>
              </div>

              <h3 className="text-3xl font-bold leading-tight">{product.name}</h3>
              <p className="text-white/80 text-lg leading-relaxed line-clamp-2">{product.description}</p>

              <div className="flex items-center justify-between pt-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black">${product.price}</span>
                  {product.original_price && (
                    <span className="text-xl text-white/60 line-through">${product.original_price}</span>
                  )}
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    on_add_to_cart()
                  }}
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-xl px-8 py-3 text-lg font-semibold"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === "featured") {
    return (
      <Card
        className={cn(
          "group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white",
          className,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-0 relative">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={product.image || "/placeholder.svg?height=300&width=400"}
              alt={product.name}
              className={cn(
                "w-full h-full object-cover transition-all duration-700",
                isHovered ? "scale-110" : "scale-100",
              )}
            />
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-500",
                isHovered ? "opacity-100" : "opacity-0",
              )}
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.rating && product.rating >= 4.5 && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 shadow-md">
                  <Award className="w-3 h-3 mr-1" />
                  TOP RATED
                </Badge>
              )}
              {discount > 0 && (
                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-md">
                  -{discount}%
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div
              className={cn(
                "absolute top-4 right-4 flex flex-col gap-2 transition-all duration-500",
                isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4",
              )}
            >
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  on_view()
                }}
                className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-blue-600 shadow-lg border-0"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 shadow-lg border-0"
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>

            {/* Quick Add Button */}
            <div
              className={cn(
                "absolute bottom-4 left-4 right-4 transition-all duration-500",
                isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
              )}
            >
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  on_add_to_cart()
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Quick Add - ${product.price}
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Badge variant="outline" className="text-xs mb-2 bg-blue-50 text-blue-700 border-blue-200">
                  {product.category.name}
                </Badge>
                <h3 className="font-bold text-lg text-gray-800 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
              </div>
            </div>

            {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-yellow-50 rounded-lg px-2 py-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-3 h-3",
                        i < Math.floor(product.rating!) ? "text-yellow-400 fill-current" : "text-gray-300",
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {product.rating} ({product.review_count} reviews)
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-800">${product.price}</span>
                {product.original_price && (
                  <span className="text-lg text-gray-500 line-through">${product.original_price}</span>
                )}
              </div>
              {product.in_stock && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-600">In Stock</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === "list") {
    return (
      <Card
        className={cn(
          "group relative overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-all duration-500 bg-white hover:-translate-y-1 cursor-pointer",
          className,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={on_view}
      >
        <CardContent className="p-0 relative">
          <div className="flex">
            {/* Image Section */}
            <div className="w-48 flex-shrink-0 relative">
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg?height=300&width=300"}
                  alt={product.name}
                  className={cn(
                    "w-full h-full object-cover transition-all duration-500",
                    isHovered ? "scale-105" : "scale-100",
                  )}
                />
              </div>

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {discount > 0 && (
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-md text-xs font-bold">
                    -{discount}%
                  </Badge>
                )}
                {product.rating && product.rating >= 4.5 && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 shadow-md text-xs">
                    <Star className="w-2 h-2 mr-1 fill-current" />
                    TOP
                  </Badge>
                )}
              </div>

              {!product.in_stock && (
                <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
                  <Badge variant="secondary" className="text-sm bg-white/90 text-gray-800">
                    Out of Stock
                  </Badge>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    {product.category.name}
                  </Badge>
                  {product.in_stock && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-green-600">In Stock</span>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{product.description}</p>
                </div>

                {product.rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-yellow-50 rounded-lg px-2 py-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-4 h-4",
                            i < Math.floor(product.rating!) ? "text-yellow-400 fill-current" : "text-gray-300",
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {product.rating} ({product.review_count} reviews)
                    </span>
                  </div>
                )}
              </div>

              {/* Price and Actions */}
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-800">${product.price}</span>
                  {product.original_price && (
                    <span className="text-lg text-gray-500 line-through">${product.original_price}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      on_view()
                    }}
                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-sm"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      on_add_to_cart()
                    }}
                    disabled={!product.in_stock}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md px-6"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default variant
  return (
    <Card
      className={cn(
        "group relative overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-all duration-500 bg-white hover:-translate-y-2 h-full flex flex-col cursor-pointer", // Add cursor-pointer
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={on_view}
    >
      <CardContent className="p-0 relative flex flex-col h-full">
        {" "}
        {/* Add flex-col and h-full */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            className={cn(
              "w-full h-full object-cover transition-all duration-500",
              isHovered ? "scale-105" : "scale-100",
            )}
          />

          {/* Overlay */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0",
            )}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discount > 0 && (
              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-md text-xs font-bold">
                -{discount}%
              </Badge>
            )}
            {product.rating && product.rating >= 4.5 && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 shadow-md text-xs">
                <Star className="w-2 h-2 mr-1 fill-current" />
                TOP
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div
            className={cn(
              "absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300",
              isHovered ? "opacity-100" : "opacity-0",
            )}
          >
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                on_view()
              }}
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-blue-600 shadow-md border-0"
            >
              <Eye className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 shadow-md border-0"
            >
              <Heart className="w-3 h-3" />
            </Button>
          </div>

          {!product.in_stock && (
            <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
              <Badge variant="secondary" className="text-sm bg-white/90 text-gray-800">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
        <div className="p-4 space-y-3 flex-1 flex flex-col">
          {" "}
          {/* Add flex-1 and flex-col to distribute space */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              {product.category.name}
            </Badge>
            {product.in_stock && (
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="text-xs font-medium text-green-600">Available</span>
              </div>
            )}
          </div>
          <h3 className="font-semibold text-gray-800 line-clamp-2 text-sm leading-tight group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          {product.rating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-3 h-3",
                      i < Math.floor(product.rating!) ? "text-yellow-400 fill-current" : "text-gray-300",
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600">
                {product.rating} ({product.review_count})
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-800">${product.price}</span>
              {product.original_price && (
                <span className="text-sm text-gray-500 line-through">${product.original_price}</span>
              )}
            </div>
          </div>
          <Button
            onClick={(e) => {
              e.stopPropagation()
              on_add_to_cart()
            }}
            disabled={!product.in_stock}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-md transition-all duration-300 mt-auto"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
