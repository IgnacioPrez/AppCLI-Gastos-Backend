import express, { Express } from 'express'
import { connectDB } from '../database/config'
import fileUpload from 'express-fileupload'
import UserRoutes from '../routes/user.routes'
import ProductsRoutes from '../routes/products.routes'
import cors from 'cors'
import IssueRoutes from '../routes/issue.routes'
import { v2 as cloudinary } from 'cloudinary'
import OrdersRoutes from '../routes/orders.routes'
import CartRoutes from '../routes/carts.routes'


export class Server {
  app: Express
  port: string | undefined
  userRoutes: string
  productRoutes: string
  ordersRoutes: string
  cartRoutes:string
  constructor() {
    this.app = express()
    this.port = process.env.PORT
    this.userRoutes = '/user'
    this.productRoutes = '/products'
    this.ordersRoutes = '/order'
    this.cartRoutes = '/cart'
    this.startDb()
    this.middlewares()
    this.routes()
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NICK,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
      secure: true,
    })
  }

  async startDb(): Promise<void> {
    await connectDB()
  }
  listen(): void {
    this.app.listen(this.port, () => {
      console.log(`El servidor esta corriendo en el puerto ${this.port}`)
    })
  }
  middlewares(): void {
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use(
      fileUpload({
        useTempFiles: true,
      })
    )
  }
  routes(): void {
    this.app.use(this.userRoutes, UserRoutes)
    this.app.use(this.productRoutes, ProductsRoutes)
    this.app.use(this.ordersRoutes, OrdersRoutes)
    this.app.use(this.cartRoutes, CartRoutes)
    this.app.use('/issue', IssueRoutes)
  }
}
