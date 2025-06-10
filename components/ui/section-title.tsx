"use client"

import { motion } from "framer-motion"

interface SectionTitleProps {
  subtitle?: string
  title: string
  highlight?: string
  description?: string
  center?: boolean
  light?: boolean
}

export default function SectionTitle({
  subtitle,
  title,
  highlight,
  description,
  center = true,
  light = false,
}: SectionTitleProps) {
  return (
    <div className={`mb-12 ${center ? "text-center" : ""}`}>
      {subtitle && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`inline-block text-sm font-medium tracking-wider uppercase ${
            light ? "text-white/70" : "text-gray-500"
          } mb-3`}
        >
          {subtitle}
        </motion.span>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`font-heading text-3xl md:text-4xl font-bold ${light ? "text-white" : "text-gray-900"}`}
      >
        {title}{" "}
        {highlight && (
          <span className="text-gradient bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
            {highlight}
          </span>
        )}
      </motion.h2>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`mt-4 text-base md:text-lg ${light ? "text-white/80" : "text-gray-700"} max-w-3xl ${
            center ? "mx-auto" : ""
          }`}
        >
          {description}
        </motion.p>
      )}
    </div>
  )
}
