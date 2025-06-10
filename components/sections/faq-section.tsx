"use client"

import { useState } from "react"
import Image from "next/image"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { FaqData } from "@/types/home-types"
import { motion } from "framer-motion"
import SectionTitle from "@/components/ui/section-title"

interface FaqSectionProps {
  data: FaqData
}

export default function FaqSection({ data }: FaqSectionProps) {
  const [openItems, setOpenItems] = useState<string[]>(
    data.faq_items.filter((item) => item.is_open).map((item) => item.id.toString()),
  )

  return (
    <section id="faq" className="py-20">
      <div className="container mx-auto px-4">
        <SectionTitle subtitle="FAQ" title={data.faq_title} highlight={data.faq_subtitle} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-4">
              {data.faq_items.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id.toString()}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
                    <span className="text-left font-semibold text-lg">{item.question_text}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 text-gray-700">{item.answer_text}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-r from-red-500 to-blue-500 rounded-lg p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">{data.faq_cta_title}</h3>
              <p className="mb-6">{data.faq_cta_description}</p>

              <a href={`tel:${data.faq_phone_number}`} className="text-2xl font-bold flex items-center mb-8">
                <span className="bg-white/20 p-3 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-phone"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </span>
                {data.faq_phone_number}
              </a>

              <div>
                <p className="font-medium mb-4">Our Happy Clients</p>
                <div className="flex -space-x-4">
                  {data.faq_client_images.map((image, index) => (
                    <div key={index} className="h-12 w-12 rounded-full border-2 border-white overflow-hidden">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Client ${index + 1}`}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                  <div className="h-12 w-12 rounded-full border-2 border-white bg-white/20 flex items-center justify-center text-white font-medium">
                    100+
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
