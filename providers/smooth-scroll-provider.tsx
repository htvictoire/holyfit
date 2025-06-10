"use client"

import { type ReactNode, useEffect, useState } from "react"
import Lenis from "@studio-freight/lenis"

interface SmoothScrollProviderProps {
  children: ReactNode
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    })

    setLenis(lenisInstance)

    // Create animation frame loop for Lenis
    function raf(time: number) {
      lenisInstance.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Handle resize for responsive behavior
    const resizeObserver = new ResizeObserver(() => {
      lenisInstance.resize()
    })

    resizeObserver.observe(document.body)

    return () => {
      lenisInstance.destroy()
      resizeObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    function onLinkClick(event: MouseEvent) {
      const target = event.target as HTMLElement
      const anchor = target.closest("a")

      if (!anchor) return

      const href = anchor.getAttribute("href")
      const isInternalLink = href?.startsWith("#")

      if (isInternalLink && lenis && href) {
        event.preventDefault()
        lenis.scrollTo(href)
      }
    }

    document.addEventListener("click", onLinkClick)
    return () => document.removeEventListener("click", onLinkClick)
  }, [lenis])

  return <>{children}</>
}
