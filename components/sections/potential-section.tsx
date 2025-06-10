"use client"

import Image from "next/image"
import { Check } from "lucide-react"
import type { PotentialData } from "@/types/home-types"
import { useEffect, useState } from "react"
import SectionTitle from "@/components/ui/section-title"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface PotentialSectionProps {
  data: PotentialData
}

export default function PotentialSection({ data }: PotentialSectionProps) {
  const [counters, setCounters] = useState<number[]>(data.stats.map(() => 0))
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true)
        }
      },
      { threshold: 0.1 },
    )

    const section = document.getElementById(data.section_id)
    if (section) {
      observer.observe(section)
    }

    return () => {
      if (section) {
        observer.unobserve(section)
      }
    }
  }, [data.section_id])

  useEffect(() => {
    if (!inView) return

    const intervals = data.stats.map((stat, index) => {
      return setInterval(() => {
        setCounters((prev) => {
          const newCounters = [...prev]
          if (newCounters[index] < stat.max_value) {
            newCounters[index] += 1
          } else {
            clearInterval(intervals[index])
          }
          return newCounters
        })
      }, 30)
    })

    return () => {
      intervals.forEach((interval) => clearInterval(interval))
    }
  }, [inView, data.stats])

  return (
    <section id={data.section_id} className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionTitle
              subtitle={data.title}
              title={data.main_heading}
              highlight={data.highlighted_text}
              description={data.description}
              center={false}
            />

            <div className="grid grid-cols-2 gap-4 mb-8">
              {data.stats.map((stat, index) => (
                <div key={stat.id} className="bg-white shadow-sm rounded-lg p-4">
                  <div className="text-3xl font-bold text-red-500 mb-1 flex items-end">
                    {counters[index]}
                    <span className="text-xl ml-1">{stat.unit}</span>
                  </div>
                  <p className="text-gray-700 font-medium capitalize">{stat.label}</p>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold mb-4 text-gray-900">{data.body_heading}</h3>
            <p className="text-gray-700 mb-6">{data.body_description}</p>

            <ul className="space-y-3 mb-8">
              {data.benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Check className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{benefit}</span>
                </motion.li>
              ))}
            </ul>

            <Button className="bg-gradient-to-r from-red-500 to-blue-500 hover:opacity-90 text-white">
              Unlock Your Potential
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <Image
                src={data.image || "/placeholder.svg"}
                alt="Unlock your potential"
                width={600}
                height={800}
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
