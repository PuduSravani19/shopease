import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import Product from './models/Product.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '.env') })

// ── Map Fake Store categories to our categories ──
const categoryMap = {
  "electronics": "Electronics",
  "jewelery": "Other",
  "men's clothing": "Clothing",
  "women's clothing": "Clothing",
}

const seedProducts = async () => {
  try {
    // connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB connected')

    // fetch products from Fake Store API
    console.log('📦 Fetching products from Fake Store API...')
    const response = await fetch('https://fakestoreapi.com/products')
    const fakeProducts = await response.json()

    // delete existing products
    await Product.deleteMany({})
    console.log('🗑️  Cleared existing products')

    // transform and insert products
    const products = fakeProducts.map(p => ({
      name: p.title,
      description: p.description,
      price: Math.round(p.price * 83), // convert USD to INR
      category: categoryMap[p.category] || 'Other',
      image: p.image,
      stock: Math.floor(Math.random() * 50) + 10, // random stock 10-60
      ratings: p.rating.rate,
      numReviews: p.rating.count,
    }))

    await Product.insertMany(products)
    console.log(`✅ ${products.length} products added successfully!`)

    // show summary
    console.log('\n📊 Products added:')
    products.forEach(p => {
      console.log(`  • ${p.name.substring(0, 40)}... ₹${p.price}`)
    })

    mongoose.disconnect()
    console.log('\n✅ Done! Run your frontend to see products.')

  } catch (err) {
    console.error('❌ Seed failed:', err.message)
    mongoose.disconnect()
  }
}

seedProducts()