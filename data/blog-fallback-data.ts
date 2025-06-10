import type { BlogPost, BlogPostsResponse, CategoryItem, TagItem } from "@/types/blog-types"

export const fallbackCategories: CategoryItem[] = [
  {
    id: "1",
    name: "Fitness",
    post_count: 12,
    sub_categories: [
      {
        id: "1-1",
        name: "Strength Training",
        post_count: 5,
      },
      {
        id: "1-2",
        name: "Cardio",
        post_count: 4,
      },
      {
        id: "1-3",
        name: "Flexibility",
        post_count: 3,
      },
    ],
  },
  {
    id: "2",
    name: "Nutrition",
    post_count: 8,
    sub_categories: [
      {
        id: "2-1",
        name: "Meal Planning",
        post_count: 3,
      },
      {
        id: "2-2",
        name: "Supplements",
        post_count: 2,
      },
      {
        id: "2-3",
        name: "Recipes",
        post_count: 3,
      },
    ],
  },
  {
    id: "3",
    name: "Wellness",
    post_count: 6,
    sub_categories: [
      {
        id: "3-1",
        name: "Mental Health",
        post_count: 2,
      },
      {
        id: "3-2",
        name: "Sleep",
        post_count: 2,
      },
      {
        id: "3-3",
        name: "Recovery",
        post_count: 2,
      },
    ],
  },
  {
    id: "4",
    name: "Success Stories",
    post_count: 4,
  },
  {
    id: "5",
    name: "Training Programs",
    post_count: 3,
  },
]

export const fallbackTags: TagItem[] = [
  {
    id: "1",
    name: "Beginner",
    post_count: 8,
  },
  {
    id: "2",
    name: "Advanced",
    post_count: 6,
  },
  {
    id: "3",
    name: "Weight Loss",
    post_count: 10,
    sub_tags: [
      {
        id: "3-1",
        name: "Fat Burning",
        post_count: 4,
      },
      {
        id: "3-2",
        name: "Metabolism",
        post_count: 3,
      },
    ],
  },
  {
    id: "4",
    name: "Muscle Building",
    post_count: 7,
    sub_tags: [
      {
        id: "4-1",
        name: "Hypertrophy",
        post_count: 3,
      },
      {
        id: "4-2",
        name: "Strength",
        post_count: 4,
      },
    ],
  },
  {
    id: "5",
    name: "Healthy Eating",
    post_count: 5,
  },
  {
    id: "6",
    name: "Workout Tips",
    post_count: 9,
  },
]

export const fallbackPosts: BlogPost[] = [
  {
    id: 1,
    title: "10 Essential Exercises for Building Core Strength",
    slug: "10-essential-exercises-for-building-core-strength",
    image: "/placeholder.svg?height=600&width=800",
    category: "Fitness",
    category_id: "1",
    author: "John Doe",
    date: "2023-05-15",
    excerpt: "Discover the most effective exercises to strengthen your core and improve overall stability.",
  },
  {
    id: 2,
    title: "The Ultimate Guide to Meal Prepping for Fitness Success",
    slug: "ultimate-guide-to-meal-prepping",
    image: "/placeholder.svg?height=600&width=800",
    category: "Nutrition",
    category_id: "2",
    author: "Jane Smith",
    date: "2023-06-02",
    excerpt: "Learn how to prepare healthy meals in advance to support your fitness goals.",
  },
  {
    id: 3,
    title: "How to Optimize Your Sleep for Better Recovery",
    slug: "optimize-sleep-for-better-recovery",
    image: "/placeholder.svg?height=600&width=800",
    category: "Wellness",
    category_id: "3",
    author: "Mike Johnson",
    date: "2023-06-10",
    excerpt: "Discover science-backed strategies to improve your sleep quality and enhance recovery.",
  },
  {
    id: 4,
    title: "From Couch to 5K: Sarah's Transformation Story",
    slug: "couch-to-5k-transformation-story",
    image: "/placeholder.svg?height=600&width=800",
    category: "Success Stories",
    category_id: "4",
    author: "Sarah Williams",
    date: "2023-06-18",
    excerpt: "Read how Sarah went from sedentary to running her first 5K in just 12 weeks.",
  },
  {
    id: 5,
    title: "The Science Behind High-Intensity Interval Training",
    slug: "science-behind-hiit",
    image: "/placeholder.svg?height=600&width=800",
    category: "Fitness",
    category_id: "1-2",
    author: "Dr. Robert Chen",
    date: "2023-06-25",
    excerpt: "Understand the physiological benefits of HIIT and why it's so effective for fat loss.",
  },
  {
    id: 6,
    title: "5 Protein-Packed Smoothie Recipes for Post-Workout Recovery",
    slug: "protein-smoothie-recipes",
    image: "/placeholder.svg?height=600&width=800",
    category: "Nutrition",
    category_id: "2-3",
    author: "Chef Maria Garcia",
    date: "2023-07-05",
    excerpt: "Try these delicious smoothie recipes designed to maximize muscle recovery after training.",
  },
  {
    id: 7,
    title: "Mindfulness Meditation for Athletes: Improving Focus and Performance",
    slug: "mindfulness-meditation-for-athletes",
    image: "/placeholder.svg?height=600&width=800",
    category: "Wellness",
    category_id: "3-1",
    author: "Dr. Lisa Thompson",
    date: "2023-07-12",
    excerpt: "Learn how mindfulness practices can enhance athletic performance and mental resilience.",
  },
  {
    id: 8,
    title: "The Complete 12-Week Strength Training Program for Beginners",
    slug: "12-week-strength-training-program",
    image: "/placeholder.svg?height=600&width=800",
    category: "Training Programs",
    category_id: "5",
    author: "Coach David Wilson",
    date: "2023-07-20",
    excerpt: "Follow this comprehensive program to build strength and muscle as a beginner.",
  },
  {
    id: 9,
    title: "Understanding Macronutrients: A Guide to Protein, Carbs, and Fats",
    slug: "understanding-macronutrients",
    image: "/placeholder.svg?height=600&width=800",
    category: "Nutrition",
    category_id: "2",
    author: "Nutritionist Emily Brown",
    date: "2023-07-28",
    excerpt: "Learn how to balance your macronutrients for optimal health and fitness results.",
  },
  {
    id: 10,
    title: "How John Lost 50 Pounds and Gained His Life Back",
    slug: "john-weight-loss-story",
    image: "/placeholder.svg?height=600&width=800",
    category: "Success Stories",
    category_id: "4",
    author: "John Peterson",
    date: "2023-08-05",
    excerpt: "John shares his inspiring journey of weight loss and lifestyle transformation.",
  },
]

export const fallbackPostsResponse: BlogPostsResponse = {
  count: fallbackPosts.length,
  next: null,
  previous: null,
  results: fallbackPosts,
}

export default {
  categories: fallbackCategories,
  tags: fallbackTags,
  posts: fallbackPostsResponse,
}
