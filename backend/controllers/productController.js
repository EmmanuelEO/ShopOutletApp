import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

// @desc: Fetch all products
// @route: GET request to /api/products
// @access: Public
const getProducts = asyncHandler(async (req, res) => {
  // req.query is how to get query strings like keyword from ?item=keyword
  const pageSize = 10
  // If the pageNumber is not included, then we're on page 1
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          // $options: i specifies case insensitiveness
          $options: 'i',
        },
      }
    : {}

  const count = await Product.count({ ...keyword })
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({ products, page, pages: Math.ceil(count / pageSize) })
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

  if (product) {
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

// @desc: Create a new review
// @route: POST request to /api/products/:id/reviews
// @access: Private/Admin
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    const hasBeenReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    )

    if (hasBeenReviewed) {
      // Status of Bad Request
      res.status(400)
      throw new Error('Product has already been reviewed')
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }

    product.reviews.push(review)

    product.numReviews = product.reviews.length

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.numReviews

    await product.save()

    res.status(201).json({ message: 'Review added' })
  } else {
    res.status(404)
    throw new Error('Product Not Found')
  }
})

// @desc: Get top rated products
// @route: POST request to /api/products/top
// @access: Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(4)
  res.json(products)
})

export {
  getProducts,
  getProductByID,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
}
