import { model, Schema, Model, ObjectId } from 'mongoose'

interface Items {
  productId: ObjectId
  quantity: number
}

export interface ICart {
  userId: ObjectId
  productsId: ObjectId
  totalPrice: number
  createdAt: Date
  items: Items
  statusPaid:boolean
}

const cartSchema = new Schema<ICart>({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: Number,
    },
  ],
  totalPrice: { type: Number },
  statusPaid:{type:Boolean,default:false},
  createdAt: { type: Date, default: Date.now() },
})

export const Cart: Model<ICart> = model('Cart', cartSchema)
