"use client"

import Image from "next/image"
import { Check } from "lucide-react"
import { motion } from "framer-motion"
import type { AboutData } from "@/types/home-types"
import { Button } from "@/components/ui/button"

interface AboutSectionProps {
  data: AboutData
}

export default function AboutSection({ data }: AboutSectionProps) {
  return (
    <section id={data.section_id} className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-3"
          >
            {data.about_title}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold"
          >
            {data.main_heading}{" "}
            <span className="text-gradient bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
              {data.highlighted_text}
            </span>
          </motion.h2>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "60px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="h-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-full my-6"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg text-gray-700 mb-8">{data.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center">
                <div className="bg-red-500/10 p-3 rounded-full mr-4">
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
                    className="text-red-500"
                  >
                    <path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z"></path>
                    <polyline points="2.32 6.16 12 11 21.68 6.16"></polyline>
                    <line x1="12" y1="22.76" x2="12" y2="11"></line>
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">
                    {data.years_of_experience_text.replace(/<[^>]*>/g, "")}
                  </p>
                  <p className="text-sm text-gray-600">Professional expertise</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-blue-500/10 p-3 rounded-full mr-4">
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
                    className="text-blue-500"
                  >
                    <path d="M17 18a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12z"></path>
                    <path d="M17 14H7"></path>
                    <path d="M7 10h10"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{data.five_star_reviews_text}</p>
                  <p className="text-sm text-gray-600">Client satisfaction</p>
                </div>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {data.about_us_list.map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <div className="mr-3 mt-1">
                    <Check className="h-5 w-5 text-red-500" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </motion.li>
              ))}
            </ul>

            <Button
              className="bg-gradient-to-r from-red-500 to-blue-500 hover:opacity-90 text-white"
              onClick={() => {
                document.getElementById("contact-us")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              {data.get_in_touch_text}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <Image
                src={data.about_image_1 || "/placeholder.svg?height=800&width=600"}
                alt="About HolyFit"
                width={600}
                height={800}
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="absolute -bottom-6 left-6 bg-white p-4 shadow-lg rounded-lg max-w-xs">
              <p className="text-base font-medium mb-3 text-gray-900">
                Join our <span className="font-bold text-red-500">100+</span> satisfied clients
              </p>
              <div className="flex -space-x-3">
                {data.client_images.map((image, index) => (
                  <div key={index} className="h-10 w-10 rounded-full border-2 border-white overflow-hidden">
                    <Image
                      src={image || "/placeholder.svg?height=40&width=40"}
                      alt={`Client ${index + 1}`}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
                <div className="h-10 w-10 rounded-full border-2 border-white bg-red-500 flex items-center justify-center text-white font-medium text-xs">
                  100+
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
