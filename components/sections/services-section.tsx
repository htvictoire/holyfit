"use client"

import { motion } from "framer-motion"
import type { ServicesData } from "@/types/home-types"
import SectionTitle from "@/components/ui/section-title"
import { Button } from "@/components/ui/button"
import { DynamicIcon } from "@/utils/icon-utils"

interface ServicesSectionProps {
  data: ServicesData
}

export default function ServicesSection({ data }: ServicesSectionProps) {
  return (
    <section id={data.section_id} className="py-20">
      <div className="container mx-auto px-4">
        <SectionTitle
          subtitle={data.title}
          title={data.main_heading}
          highlight={data.highlighted_text}
          description={data.description}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {data.services.map((service, index) => (
            <motion.div
              key={service.id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="bg-red-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <DynamicIcon
                  iconName={typeof service.icon === "string" ? service.icon : "Dumbbell"}
                  className="h-6 w-6 text-red-500"
                />
              </div>

              <h3 className="text-xl font-bold mb-3 text-gray-900">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button
            className="bg-gradient-to-r from-red-500 to-blue-500 hover:opacity-90 text-white"
            onClick={() => {
              document.getElementById("contact-us")?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            {data.contact_button_text}
          </Button>
        </div>
      </div>
    </section>
  )
}
