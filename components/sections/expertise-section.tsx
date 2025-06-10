"use client"

import Image from "next/image"
import type { ExpertiseData } from "@/types/home-types"
import SectionTitle from "@/components/ui/section-title"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface ExpertiseSectionProps {
  data: ExpertiseData
}

export default function ExpertiseSection({ data }: ExpertiseSectionProps) {
  return (
    <section id={data.section_id} className="py-20">
      <div className="container mx-auto px-4">
        <SectionTitle
          subtitle={data.title}
          title={data.main_heading}
          highlight={data.highlighted_text}
          description={data.description}
        />

        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {data.expertise_items && data.expertise_items.length > 0 ? (
            data.expertise_items.map((item, index) => (
              <motion.div
                key={item.id}
                className="group relative overflow-hidden rounded-lg shadow-md bg-white w-full max-w-[280px]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="aspect-[4/3] relative">
                  <Image
                    src={item.image || "/placeholder.svg?height=400&width=600"}
                    alt={item.content}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 280px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-4 w-full">
                      <h3 className="text-lg font-bold text-white text-center">{item.content}</h3>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 bg-gray-100 rounded-lg w-full">
              <p className="text-gray-500">No expertise items available</p>
            </div>
          )}
        </div>

        <div className="text-center">
          <Button
            className="bg-gradient-to-r from-red-500 to-blue-500 hover:opacity-90 text-white"
            onClick={() => {
              document.getElementById("contact-us")?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            {data.button_text}
          </Button>
        </div>
      </div>
    </section>
  )
}
