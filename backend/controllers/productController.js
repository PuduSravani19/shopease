import Product from '../models/Product.js'

// ── Get all products (with search + filter) ───
export const getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort } = req.query

    // build filter object
    let filter = {}

    if (search) {
      filter.name = { $regex: search, $options: 'i' }
    }

    if (category) {
      filter.category = category
    }

    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }

    // build sort object
    let sortObj = {}
    if (sort === 'price_asc') sortObj.price = 1
    else if (sort === 'price_desc') sortObj.price = -1
    else if (sort === 'rating') sortObj.ratings = -1
    else sortObj.createdAt = -1

    const products = await Product.find(filter).sort(sortObj)

    res.json({
      count: products.length,
      products,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ── Get single product ────────────────────────
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ── Create product (admin) ────────────────────
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'Please fill all required fields' })
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image,
      stock,
    })

    res.status(201).json({
      message: 'Product created successfully',
      product,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ── Update product (admin) ────────────────────
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ── Delete product (admin) ────────────────────
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    await Product.findByIdAndDelete(req.params.id)

    res.json({ message: 'Product deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}