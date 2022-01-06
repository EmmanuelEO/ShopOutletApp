import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

// @desc: Fetch all products
// @route: GET request to /api/products
// @access: Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
  res.json(products)
})

// @desc: Fetch single product
// @route: GET request to /api/products/:id
// @access: Public
const getProductByID = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc: Delete a Product
// @route: DELETE request to /api/products/:id
// @access: Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    await product.remove()
    res.json({ message: 'Product Removed' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc: Create a Product
// @route: POST request to /api/products/
// @access: Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpeg',
    brand: 'Sample Brand',
    category: 'Sample Category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample Description',
  })

  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

// @desc: Update a Product
// @route: PUT request to /api/products/:id
// @access: Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body

  const product = await Product.findById(req.params.id)

  if(product) {
    product.name = req.body.name
    product.price = req.body.price
    product.description = req.body.description
    product.image = req.body.image
    product.brand = req.body.brand
    product.category = req.body.category
    product.countInStock = req.body.countInStock

    const updatedProduct = await product.save()
    res.status(201).json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Product Not Found')
  }
})

export {
  getProducts,
  getProductByID,
  deleteProduct,
  createProduct,
  updateProduct,
}
