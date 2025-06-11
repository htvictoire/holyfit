/**
 * Store service for fetching store data from the /store-data/ API
 */
import type { Product, ProductCategory } from "@/types/store-types";
import { products, categories } from "@/data/store-data";

// API base URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003/api/v1';

/**
 * Fetch all store data from /store-data/ endpoint
 * Falls back to local data if API fails
 */
export async function fetchStoreData(): Promise<{
  products: Product[];
  categories: ProductCategory[];
}> {
  try {
    const response = await fetch(`${API_URL}/store/store-data/`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log("Store data loaded from API successfully", data);
    return data;
  } catch (error) {
    console.error("Error fetching store data from API:", error);
    console.log("Falling back to local store data");
    
    // Fallback to local data
    return {
      products: products,
      categories: categories
    };
  }
}