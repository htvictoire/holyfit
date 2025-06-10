"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { useMouse } from "@/hooks/use-mouse"

export default function CustomCursor() {
  const { mouse } = useMouse()
  const [cursorText, setCursorText] = useState("")
  const [cursorVariant, setCursorVariant] = useState("default")
  const [isClicking, setIsClicking] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)

  // Spring physics for smooth cursor movement
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 700 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      // Check for interactive elements
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.dataset.cursor === "pointer"
      ) {
        setCursorVariant("hover")

        // Get custom text if available
        const text =
          target.getAttribute("data-cursor-text") ||
          target.closest("[data-cursor-text]")?.getAttribute("data-cursor-text") ||
          ""
        setCursorText(text)
      } else {
        setCursorVariant("default")
        setCursorText("")
      }
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    document.addEventListener("mouseover", handleMouseOver)
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mouseover", handleMouseOver)
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  useEffect(() => {
    cursorX.set(mouse.x)
    cursorY.set(mouse.y)
  }, [mouse, cursorX, cursorY])

  // Cursor variants - simplified and more subtle
  const variants = {
    default: {
      height: 20,
      width: 20,
      x: -10,
      y: -10,
      backgroundColor: "rgba(255, 75, 92, 0)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      mixBlendMode: "normal" as const,
    },
    hover: {
      height: 40,
      width: 40,
      x: -20,
      y: -20,
      backgroundColor: "rgba(255, 75, 92, 0.05)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      mixBlendMode: "normal" as const,
    },
  }

  return (
    <>
      {/* Main cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-50 flex items-center justify-center text-sm font-medium text-primary rounded-full"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        variants={variants}
        animate={cursorVariant}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
      >
        {cursorText && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white/80 px-2 py-1 rounded-full text-xs font-medium"
          >
            {cursorText}
          </motion.span>
        )}

        {/* Click ripple effect */}
        {isClicking && (
          <motion.div
            className="absolute inset-0 rounded-full bg-primary"
            initial={{ opacity: 0.3, scale: 0.5 }}
            animate={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </motion.div>

      {/* Cursor dot */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-50 bg-white"
        animate={{
          x: mouse.x - 2,
          y: mouse.y - 2,
          scale: isClicking ? 0.5 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 1500,
          damping: 30,
          mass: 0.1,
        }}
        style={{
          height: 4,
          width: 4,
          boxShadow: "0 0 5px rgba(255, 255, 255, 0.3)",
        }}
      />
    </>
  )
}
