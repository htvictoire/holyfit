export interface HomePageData {
  id: number
  hero: HeroData
  about: AboutData
  services: ServicesData
  pricing: PricingData
  potential: PotentialData
  expertise: ExpertiseData
  video_section: VideoSectionData
  contact: ContactData
  faq: FaqData
}

export interface HeroData {
  id: number
  coaching_steps: {
    id: number
    icon: string
    text: string
  }[]
  welcome_title: string
  main_heading: string
  highlighted_text: string
  about_us_text: string
  our_expertise_text: string
  background_image: string
}

export interface AboutData {
  id: number
  section_id: string
  about_title: string
  main_heading: string
  highlighted_text: string
  description: string
  about_us_list: string[]
  years_of_experience_text: string
  experience_icon: string
  five_star_reviews_text: string
  about_image_1: string
  company_clients_text: string
  client_images: string[]
  company_result_icon: string
  company_result_title: string
  company_result_description: string
  get_in_touch_text: string
}

export interface ServicesData {
  id: number
  services: {
    id: number
    icon: string
    title: string
    description: string
    delay: number
  }[]
  section_id: string
  title: string
  main_heading: string
  highlighted_text: string
  description: string
  contact_button_text: string
  footer_text: string
  footer_highlight: string
  footer_link_text: string
}

export interface PricingData {
  id: number
  packages: {
    id: number
    title: string
    currency: string
    price: string
    delay: number
    highlighted: boolean
    unit: string
    button_text: string
    features: string[]
  }[]
  benefits: {
    id: number
    icon: string
    text: string
  }[]
  section_id: string
  title: string
  main_heading: string
  highlighted_text: string
  description: string
  button_text: string
  button_link: string
}

export interface PotentialData {
  id: number
  stats: {
    id: number
    label: string
    max_value: number
    unit: string
  }[]
  section_id: string
  title: string
  main_heading: string
  highlighted_text: string
  description: string
  image: string
  body_heading: string
  body_description: string
  benefits: string[]
}

export interface ExpertiseData {
  id: number
  expertise_items: {
    id: number
    image: string
    content: string
    delay: number
  }[]
  section_id: string
  title: string
  main_heading: string
  highlighted_text: string
  description: string
  button_link: string
  button_text: string
}

export interface VideoSectionData {
  id: number
  section_id: string
  title: string
  subtitle: string
  video_url: string
  watch_text: string
  back_ground_image: string
  list_items: string[]
}

export interface ContactData {
  id: number
  form_fields: {
    id: number
    name: string
    placeholder: string
    required: boolean
  }[]
  contact_info: {
    id: number
    title: string
    description: string
    icon: string
    value: string
  }[]
  title: string
  subtitle: string
  contact_title: string
  contact_description: string
}

export interface FaqData {
  id: number
  faq_items: {
    id: number
    question_text: string
    answer_text: string
    is_open: boolean
  }[]
  faq_title: string
  faq_subtitle: string
  faq_cta_title: string
  faq_cta_description: string
  faq_phone_number: string
  faq_client_images: string[]
}
