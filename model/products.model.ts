import { model, Schema, Model, ObjectId } from 'mongoose'

interface Image {
  public_id: string
  url: string
}

export interface IProducts {
  title: string
  price: number
  description: string
  nameCategory: string
  image: Image
  createdAt: Date
}

const productsSchema = new Schema<IProducts>({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required:true },
  nameCategory: {type:String, required:true},
  image: {
    type: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    required:true
  },
  createdAt: { type: Date, default: Date.now() },
})

export const Products: Model<IProducts> = model('Product', productsSchema)
