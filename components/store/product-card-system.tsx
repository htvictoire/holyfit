"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import {
  Star,
  ShoppingCart,
  Eye,
  Heart,
  Zap,
  Award,
  TrendingUp,
  Clock,
  Shield,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useStoreState } from "@/store/store-store"
import { cn } from "@/lib/utils"
import type { Product } from "@/types/store-types"

interface ProductCardProps {
  product: Product
  variant?: "hero" | "featured" | "standard" | "compact" | "list" | "masonry"
  priority?: boolean
  className?: string
}

export function ProductCard({ product, variant = "standard", priority = false, className }: ProductCardProps) {
  const {
    add_to_cart,
    add_to_wishlist,
    remove_from_wishlist,
    add_to_comparison,
    open_product_modal,
    open_quick_view,
    wishlist,
    comparison,
    track_product_view,
  } = useStoreState()

  const [isHovered, setIsHovered] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [quantity, setQuantity] = useState(1)

  const cardRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const isInView = useInView(cardRef, { once: true, margin: "100px" })

  const images = product.images || [product.image]
  const isInWishlist = wishlist.some((item) => item.product_id === product.id)
  const isInComparison = comparison.some((item) => item.product_id === product.id)
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0

  useEffect(() => {
    if (isInView) {
      track_product_view(product.id)
    }
  }, [isInView, product.id, track_product_view])

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (product.variants && product.variants.length > 0) {
      open_product_modal(product)
    } else {
      add_to_cart(product, quantity)
    }
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isInWishlist) {
      remove_from_wishlist(product.id)
    } else {
      add_to_wishlist(product)
    }
  }

  const handleComparisonToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isInComparison && comparison.length < 4) {
      add_to_comparison(product)
    }
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation()
    open_quick_view(product)
  }

  const handleProductClick = () => {
    open_product_modal(product)
  }

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const toggleVideo = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsVideoPlaying(!isVideoPlaying)
    }
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  // Hero Variant - Large showcase card
  if (variant === "hero") {
    return (
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={cn("group relative overflow-hidden rounded-3xl cursor-pointer", className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleProductClick}
      >
        <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 h-[600px]">
          <CardContent className="p-0 relative h-full">
            {/* Background Media */}
            <div className="absolute inset-0">
              {product.video && isHovered ? (
                <video
                  ref={videoRef}
                  src={product.video}
                  className="w-full h-full object-cover"
                  muted={isMuted}
                  loop
                  playsInline
                  onLoadedData={() => setIsImageLoaded(true)}
                />
              ) : (
                <img
                  src={images[currentImageIndex] || "/placeholder.svg?height=600&width=800"}
                  alt={product.name}
                  className={cn(
                    "w-full h-full object-cover transition-all duration-1000",
                    isHovered ? "scale-110 brightness-75" : "scale-100 brightness-50",
                  )}
                  loading={priority ? "eager" : "lazy"}
                  onLoad={() => setIsImageLoaded(true)}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            </div>

            {/* Floating Elements */}
            <div className="absolute top-8 left-8 flex flex-col gap-4">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }}>
                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-xl px-4 py-2 text-lg font-bold">
                  <Zap className="w-4 h-4 mr-2" />
                  BESTSELLER
                </Badge>
              </motion.div>

              {discount > 0 && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }}>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-xl px-4 py-2 text-lg font-bold">
                    -{discount}% OFF
                  </Badge>
                </motion.div>
              )}
            </div>

            {/* Action Buttons */}
            <motion.div
              className="absolute top-8 right-8 flex flex-col gap-4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 50 }}
              transition={{ duration: 0.3 }}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="lg"
                      onClick={handleQuickView}
                      className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white shadow-xl"
                    >
                      <Eye className="w-6 h-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Quick View</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="lg"
                      onClick={handleWishlistToggle}
                      className={cn(
                        "w-14 h-14 rounded-full backdrop-blur-md border border-white/20 shadow-xl transition-all",
                        isInWishlist
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "bg-white/10 hover:bg-white/20 text-white",
                      )}
                    >
                      <Heart className={cn("w-6 h-6", isInWishlist && "fill-current")} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="lg"
                      onClick={handleComparisonToggle}
                      disabled={!isInComparison && comparison.length >= 4}
                      className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white shadow-xl disabled:opacity-50"
                    >
                      <TrendingUp className="w-6 h-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Compare Products</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>

            {/* Image Navigation */}
            {images.length > 1 && (
              <div className="absolute top-1/2 left-4 right-4 flex justify-between transform -translate-y-1/2">
                <Button
                  size="lg"
                  onClick={prevImage}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  size="lg"
                  onClick={nextImage}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </div>
            )}

            {/* Video Controls */}
            {product.video && isHovered && (
              <div className="absolute bottom-32 right-8 flex gap-2">
                <Button
                  size="sm"
                  onClick={toggleVideo}
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white"
                >
                  <Play className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={toggleMute}
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
              </div>
            )}

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-10">
              <motion.div
                className="text-white space-y-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-4">
                  <Badge
                    variant="outline"
                    className="text-white border-white/30 bg-white/10 backdrop-blur-sm px-3 py-1"
                  >
                    {product.category.name}
                  </Badge>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-5 h-5",
                          i < Math.floor(product.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-400",
                        )}
                      />
                    ))}
                    <span className="text-sm text-white/80 ml-2">({product.review_count})</span>
                  </div>
                </div>

                <h3 className="text-4xl font-black leading-tight">{product.name}</h3>
                <p className="text-white/80 text-xl leading-relaxed line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-baseline gap-4">
                    <span className="text-5xl font-black">${product.price}</span>
                    {product.original_price && (
                      <span className="text-2xl text-white/60 line-through">${product.original_price}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setQuantity(Math.max(1, quantity - 1))
                        }}
                        className="w-10 h-10 rounded-l-xl bg-transparent hover:bg-white/20 text-white border-0"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="px-4 py-2 text-white font-bold">{quantity}</span>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setQuantity(quantity + 1)
                        }}
                        className="w-10 h-10 rounded-r-xl bg-transparent hover:bg-white/20 text-white border-0"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <Button
                      onClick={handleAddToCart}
                      size="lg"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-xl px-8 py-4 text-xl font-bold rounded-xl"
                    >
                      <ShoppingCart className="w-6 h-6 mr-3" />
                      Add to Cart
                    </Button>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex items-center gap-2 text-white/80">
                    <Truck className="w-5 h-5" />
                    <span className="text-sm">Free Shipping</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <Shield className="w-5 h-5" />
                    <span className="text-sm">Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <RotateCcw className="w-5 h-5" />
                    <span className="text-sm">30-Day Returns</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Image Indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentImageIndex(index)
                    }}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all",
                      index === currentImageIndex ? "bg-white" : "bg-white/40",
                    )}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Featured Variant - Medium showcase card
  if (variant === "featured") {
    return (
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn("group relative overflow-hidden cursor-pointer", className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleProductClick}
      >
        <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white h-full">
          <CardContent className="p-0 relative h-full">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={images[currentImageIndex] || "/placeholder.svg?height=300&width=400"}
                alt={product.name}
                className={cn(
                  "w-full h-full object-cover transition-all duration-700",
                  isHovered ? "scale-110" : "scale-100",
                )}
                loading={priority ? "eager" : "lazy"}
                onLoad={() => setIsImageLoaded(true)}
              />

              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
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
                {!product.in_stock && <Badge className="bg-gray-500 text-white border-0 shadow-md">OUT OF STOCK</Badge>}
              </div>

              {/* Action Buttons */}
              <motion.div
                className="absolute top-4 right-4 flex flex-col gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  size="sm"
                  onClick={handleQuickView}
                  className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-blue-600 shadow-lg border-0"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={handleWishlistToggle}
                  className={cn(
                    "w-10 h-10 rounded-full shadow-lg border-0 transition-all",
                    isInWishlist
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-white/90 hover:bg-white text-gray-600 hover:text-red-500",
                  )}
                >
                  <Heart className={cn("w-4 h-4", isInWishlist && "fill-current")} />
                </Button>
                <Button
                  size="sm"
                  onClick={handleComparisonToggle}
                  disabled={!isInComparison && comparison.length >= 4}
                  className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-purple-600 shadow-lg border-0 disabled:opacity-50"
                >
                  <TrendingUp className="w-4 h-4" />
                </Button>
              </motion.div>

              {/* Quick Add Button */}
              <motion.div
                className="absolute bottom-4 left-4 right-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.in_stock}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl disabled:opacity-50"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Quick Add - ${product.price}
                </Button>
              </motion.div>

              {/* Stock Indicator */}
              {product.stock_quantity && product.stock_quantity <= 10 && (
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-orange-500 text-white border-0 shadow-md">
                    <Clock className="w-3 h-3 mr-1" />
                    Only {product.stock_quantity} left!
                  </Badge>
                </div>
              )}
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Badge variant="outline" className="text-xs mb-2 bg-blue-50 text-blue-700 border-blue-200">
                    {product.category.name}
                  </Badge>
                  <h3 className="font-bold text-lg text-gray-800 leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
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

              {/* Progress bar for stock level */}
              {product.stock_quantity && product.stock_quantity <= 20 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Stock Level</span>
                    <span>{product.stock_quantity} remaining</span>
                  </div>
                  <Progress value={(product.stock_quantity / 20) * 100} className="h-2" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Standard Variant - Regular product card
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn("group relative overflow-hidden cursor-pointer", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleProductClick}
    >
      <Card className="border border-gray-200 shadow-md hover:shadow-xl transition-all duration-500 bg-white hover:-translate-y-2 h-full">
        <CardContent className="p-0 relative h-full">
          <div className="relative aspect-square overflow-hidden">
            <img
              src={images[currentImageIndex] || "/placeholder.svg?height=300&width=300"}
              alt={product.name}
              className={cn(
                "w-full h-full object-cover transition-all duration-500",
                isHovered ? "scale-105" : "scale-100",
              )}
              loading={priority ? "eager" : "lazy"}
              onLoad={() => setIsImageLoaded(true)}
            />

            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
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
              {product.is_new && (
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-md text-xs">
                  NEW
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <motion.div
              className="absolute top-3 right-3 flex flex-col gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                size="sm"
                onClick={handleQuickView}
                className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-blue-600 shadow-md border-0"
              >
                <Eye className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                onClick={handleWishlistToggle}
                className={cn(
                  "w-8 h-8 rounded-full shadow-md border-0 transition-all",
                  isInWishlist
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-white/90 hover:bg-white text-gray-600 hover:text-red-500",
                )}
              >
                <Heart className={cn("w-3 h-3", isInWishlist && "fill-current")} />
              </Button>
              <Button
                size="sm"
                onClick={handleComparisonToggle}
                disabled={!isInComparison && comparison.length >= 4}
                className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-purple-600 shadow-md border-0 disabled:opacity-50"
              >
                <TrendingUp className="w-3 h-3" />
              </Button>
            </motion.div>

            {!product.in_stock && (
              <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
                <Badge variant="secondary" className="text-sm bg-white/90 text-gray-800">
                  Out of Stock
                </Badge>
              </div>
            )}

            {/* Image Navigation for multiple images */}
            {images.length > 1 && isHovered && (
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentImageIndex(index)
                    }}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      index === currentImageIndex ? "bg-white" : "bg-white/50",
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="p-4 space-y-3 flex-1 flex flex-col">
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

            <h3 className="font-semibold text-gray-800 line-clamp-2 text-sm leading-tight group-hover:text-blue-600 transition-colors flex-1">
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
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-md transition-all duration-300 disabled:opacity-50 mt-auto"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {product.variants && product.variants.length > 0 ? "Select Options" : "Add to Cart"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
