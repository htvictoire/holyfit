"use client"

import { motion } from "framer-motion"
import type { PricingData } from "@/types/home-types"
import SectionTitle from "@/components/ui/section-title"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DynamicIcon } from "@/utils/icon-utils"

interface PricingSectionProps {
  data: PricingData
}

export default function PricingSection({ data }: PricingSectionProps) {
  return (
    <section id={data.section_id} className="py-20">
      <div className="container mx-auto px-4">
        <SectionTitle
          subtitle={data.title}
          title={data.main_heading}
          highlight={data.highlighted_text}
          description={data.description}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {data.packages.map((pkg, index) => {
            const isHighlighted = pkg.highlighted

            return (
              <motion.div
                key={pkg.id}
                className={`rounded-lg overflow-hidden transition-all duration-300 ${
                  isHighlighted
                    ? "shadow-lg border-2 border-red-500 relative md:-mt-4 md:mb-4"
                    : "shadow-sm border border-gray-100"
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {isHighlighted && (
                  <div className="bg-red-500 text-white text-center py-1 text-sm font-medium">Most Popular</div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 capitalize">{pkg.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Perfect for {index === 0 ? "beginners" : index === 1 ? "serious athletes" : "professionals"}
                  </p>

                  <div className="flex items-end mb-6">
                    <span className="text-2xl font-medium text-gray-700">{pkg.currency}</span>
                    <span className="text-4xl font-bold mx-1 text-gray-900">{pkg.price}</span>
                    <span className="text-base text-gray-600">{pkg.unit}</span>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      isHighlighted
                        ? "bg-gradient-to-r from-red-500 to-blue-500 text-white hover:opacity-90"
                        : "bg-white border border-gray-200 text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    {pkg.button_text}
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {data.benefits.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {data.benefits.map((benefit) => (
              <motion.div
                key={benefit.id}
                className="flex items-center bg-white shadow-sm rounded-full px-4 py-2"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <DynamicIcon
                  iconName={typeof benefit.icon === "string" ? benefit.icon : "Gift"}
                  className="h-4 w-4 text-red-500 mr-2"
                />
                <span className="text-gray-700 text-sm">{benefit.text}</span>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center">
          <Button className="bg-gradient-to-r from-red-500 to-blue-500 hover:opacity-90 text-white" asChild>
            <a href={data.button_link}>{data.button_text}</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
