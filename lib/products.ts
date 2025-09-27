// Sample product catalog for prototype
export type Product = {
  id: string
  name: string
  price: number // in local currency units for demo
  unit?: string
  image?: string
  description?: string
  seller?: string
}

export const products: Product[] = [
  {
    id: "maize-5kg",
    name: "Maize Flour 5kg",
    price: 950,
    unit: "bag",
    image: "/placeholder.jpg",
    description: "Fine milled maize flour suitable for ugali and porridge.",
    seller: "Kijiji Co-op",
  },
  {
    id: "beans-10kg",
    name: "Red Beans 10kg",
    price: 2850,
    unit: "sack",
    image: "/placeholder.jpg",
    description: "Dried red beans, Grade A.",
    seller: "Green Village",
  },
  {
    id: "goat-1",
    name: "Goat (live)",
    price: 18000,
    unit: "each",
    image: "/placeholder.jpg",
    description: "Healthy young goat, community verified.",
    seller: "Pastoral Union",
  },
  {
    id: "soap-12",
    name: "Laundry Soap (12 bars)",
    price: 1200,
    unit: "pack",
    image: "/placeholder.jpg",
    description: "Multipurpose laundry soap bars.",
    seller: "Sunrise Traders",
  },
]
