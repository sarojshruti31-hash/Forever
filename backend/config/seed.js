import 'dotenv/config'
import connectDB from './mongodb.js'
import productModel from '../models/productModel.js'

const sampleProducts = [
  {
    name: "Women Round Neck Cotton Top",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 100,
    image: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600"],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L"],
    bestSeller: true,
    date: Date.now()
  },
  {
    name: "Men Round Neck Pure Cotton T-shirt",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 200,
    image: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600"],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["M", "L", "XL"],
    bestSeller: true,
    date: Date.now()
  },
  {
    name: "Girls Round Neck Cotton Top",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 220,
    image: ["https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600"],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "L", "XL"],
    bestSeller: true,
    date: Date.now()
  },
  {
    name: "Men Tapered Fit Flat-Front Trousers",
    description: "Premium tailored fit trousers crafted from lightweight stretch fabric for maximum comfort.",
    price: 190,
    image: ["https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=600"],
    category: "Men",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL"],
    bestSeller: false,
    date: Date.now()
  },
  {
    name: "Women Zip-Front Relaxed Fit Jacket",
    description: "Stylish winter jacket designed to provide warmth without compromising on modern style.",
    price: 320,
    image: ["https://images.unsplash.com/photo-1544441893-675973e31985?w=600"],
    category: "Women",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L"],
    bestSeller: true,
    date: Date.now()
  }
]

const seedDatabase = async () => {
  try {
    await connectDB()
    const count = await productModel.countDocuments()
    if (count > 0) {
      console.log(`Database already has ${count} products. Seeding additional missing items...`)
    }
    
    await productModel.insertMany(sampleProducts)
    console.log(`✅ Successfully seeded ${sampleProducts.length} sample products into MongoDB!`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding error:', error.message)
    process.exit(1)
  }
}

seedDatabase()
