"use client"

import { Award, TrendingUp, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface StoreHeaderProps {
  total_items: number
  total_amount: number
  on_cart_click: () => void
}

export function StoreHeader({ total_items, total_amount, on_cart_click }: StoreHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-primary-dark via-primary to-secondary">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23FFFFFF' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 mb-8 lg:mb-0 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
              Elite
              <span className="bg-gradient-to-r from-accent to-white bg-clip-text text-transparent"> Gear</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-100 mb-6 leading-relaxed max-w-md mx-auto lg:mx-0">
              Premium fitness equipment and supplements for athletes who demand excellence
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-6">
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Award className="h-4 w-4 mr-2" />
                Premium Quality
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                <TrendingUp className="h-4 w-4 mr-2" />
                Fast Results
              </Badge>
            </div>
          </div>

          <div className="lg:w-1/2 relative">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-white rounded-3xl blur-3xl opacity-30 animate-pulse" />
              <Button
                onClick={on_cart_click}
                className="relative bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 text-white transition-all duration-300 h-16 sm:h-20 px-6 sm:px-8 rounded-2xl group"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <ShoppingCart className="h-8 w-8" />
                    {total_items > 0 && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-accent to-accent-light text-accent-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold animate-bounce">
                        {total_items}
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <div className="text-sm opacity-80">Your Cart</div>
                    <div className="text-xl font-bold">${total_amount.toFixed(2)}</div>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
