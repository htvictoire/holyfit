"use client"

import { useRef, useEffect } from "react"
import { useInView } from "react-intersection-observer"
import gsap from "gsap"
import SplitType from "split-type"

interface TextRevealProps {
  children: string
  className?: string
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div"
  delay?: number
}

export default function TextReveal({ children, className = "", as = "div", delay = 0 }: TextRevealProps) {
  const textRef = useRef<HTMLElement>(null)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  useEffect(() => {
    if (!textRef.current) return

    const split = new SplitType(textRef.current, {
      types: "words,chars",
      tagName: "span",
    })

    gsap.set(split.chars, {
      y: "100%",
      opacity: 0,
    })

    if (inView) {
      gsap.to(split.chars, {
        y: "0%",
        opacity: 1,
        duration: 0.8,
        stagger: 0.02,
        ease: "power4.out",
        delay,
      })
    }

    return () => {
      split.revert()
    }
  }, [inView, delay])

  const Component = as

  return (
    <Component
      ref={(el: any) => {
        textRef.current = el
        ref(el)
      }}
      className={className}
    >
      {children}
    </Component>
  )
}
