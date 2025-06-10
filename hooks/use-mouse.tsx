"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"

interface MouseContextType {
  mouse: { x: number; y: number }
  mouseNormalized: { x: number; y: number }
}

const MouseContext = createContext<MouseContextType>({
  mouse: { x: 0, y: 0 },
  mouseNormalized: { x: 0, y: 0 },
})

export function MouseProvider({ children }: { children: ReactNode }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [mouseNormalized, setMouseNormalized] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Regular mouse position
      setMouse({ x: event.clientX, y: event.clientY })

      // Normalized mouse position (-1 to 1)
      setMouseNormalized({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return <MouseContext.Provider value={{ mouse, mouseNormalized }}>{children}</MouseContext.Provider>
}

export function useMouse() {
  return useContext(MouseContext)
}
