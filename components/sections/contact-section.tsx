"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { ContactData } from "@/types/home-types"
import { useState } from "react"
import { motion } from "framer-motion"
import SectionTitle from "@/components/ui/section-title"
import { DynamicIcon } from "@/utils/icon-utils"

interface ContactSectionProps {
  data: ContactData
}

export default function ContactSection({ data }: ContactSectionProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSubmitSuccess(true)
      setFormData({})
    } catch (error) {
      setSubmitError("There was an error submitting your message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact-us" className="py-20">
      <div className="container mx-auto px-4">
        <SectionTitle title={data.title} highlight={data.subtitle} description="" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-4 capitalize">{data.contact_title}</h3>
            <p className="text-gray-700 mb-6">{data.contact_description}</p>

            {submitSuccess ? (
              <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-lg mb-8">
                <h4 className="text-xl font-bold mb-2">Message Sent Successfully!</h4>
                <p>Thank you for reaching out. We'll get back to you as soon as possible.</p>
                <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={() => setSubmitSuccess(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.form_fields.slice(0, 4).map((field) => (
                    <div key={field.id}>
                      <Input
                        type={field.name === "email" ? "email" : "text"}
                        name={field.name}
                        placeholder={field.placeholder}
                        required={field.required}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        className="py-2"
                      />
                    </div>
                  ))}
                </div>

                {data.form_fields.slice(4).map((field) => (
                  <div key={field.id}>
                    <Textarea
                      name={field.name}
                      placeholder={field.placeholder}
                      required={field.required}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      className="min-h-32"
                    />
                  </div>
                ))}

                {submitError && <div className="text-red-600 bg-red-50 p-3 rounded-md">{submitError}</div>}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-500 to-blue-500 hover:opacity-90 text-white py-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-lg shadow-md p-6 h-full">
              {data.contact_info.map((info) => (
                <div key={info.id} className="mb-6">
                  <div className="flex items-start">
                    <div className="bg-red-500/10 p-3 rounded-lg mr-4">
                      <DynamicIcon
                        iconName={typeof info.icon === "string" ? info.icon : "Phone"}
                        className="h-6 w-6 text-red-500"
                      />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{info.title}</h4>
                      <p className="text-gray-700 mb-2">{info.description}</p>
                      <a
                        href={info.title.toLowerCase().includes("call") ? `tel:${info.value}` : `mailto:${info.value}`}
                        className="text-xl font-bold text-gradient bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent"
                      >
                        {info.value}
                      </a>
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-8">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.6896508780607!2d-0.12764492302383238!3d51.50736330960046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604ce3941eb1f%3A0x1a5342fdf089c627!2sTrafalgar%20Square!5e0!3m2!1sen!2suk!4v1710962547562!5m2!1sen!2suk"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
