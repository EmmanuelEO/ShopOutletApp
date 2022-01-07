import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'

import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

dotenv.config()

connectDB()

const app = express()

// This is added to read the data stored in req.body
app.use(express.json())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
)

// Since __dirname is not available using common JS, we can create a variable to represent it using path.resolve()
const folder = path.resolve()
app.use('/frontend/public/images', express.static(path.join(folder, '/frontend/public/images')))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(folder, '/frontend/build')))

  app.get('*', (req, res) => res.sendFile(path.resolve(folder, 'frontend', 'build', 'index.html')))
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}

app.use(notFound)
// Handling errors that are not directly casted to be object IDs
app.use(errorHandler)

const PORT = process.env.PORT || 8080

app.listen(
  PORT,
  console.log(
    `Serving running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold
  )
)
