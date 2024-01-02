import express, { Express } from 'express'
import { connectDB } from '../database/config'
import fileUpload from 'express-fileupload'
import UserRoutes from '../routes/user.routes'
import ProductsRoutes from '../routes/products.routes'
import PayRoutes from '../routes/payment.routes'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { v2 as cloudinary } from 'cloudinary'
import CartRoutes from '../routes/carts.routes'


export class Server {
  app: Express
  port: string | undefined
  userRoutes: string
  productRoutes: string
  cartRoutes:string
  payRoutes:string
  constructor() {
    this.app = express()
    this.port = process.env.PORT
    this.userRoutes = '/user'
    this.productRoutes = '/products'
    this.cartRoutes = '/cart'
    this.payRoutes = '/pay'
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
    this.app.use(cors({
      origin:'https://e-commerce-nine-gamma.vercel.app/',
      credentials: true
    }))
    this.app.use(express.json())
    this.app.use(cookieParser())
    this.app.use(
      fileUpload({
        useTempFiles: true,
      })
    )
  }
  routes(): void {
    this.app.use(this.userRoutes, UserRoutes)
    this.app.use(this.productRoutes, ProductsRoutes)
    this.app.use(this.cartRoutes, CartRoutes)
    this.app.use(this.payRoutes,PayRoutes)
  }
}
