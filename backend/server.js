import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'

import productRoutes from './routes/productRoutes.js'

dotenv.config()

connectDB()

const app = express()

app.get('/', (req, res) => {
  res.send('API is running....')
})

app.use('/api/products', productRoutes)

app.use(notFound)

// Handling errors that are not directly casted to be object IDs
app.use(errorHandler)

const PORT = process.env.PORT || 1000

app.listen(
  PORT,
  console.log(
    `Serving running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold
  )
)
