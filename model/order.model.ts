import { model, Schema, Model, ObjectId } from 'mongoose'


export interface IOrder {
    status:boolean
    cartId:ObjectId
    createdAt:Date
    payId:string
}

const  OrderSchema =  new Schema<IOrder>({
    status:{type:Boolean},
    createdAt:{type:Date, default: Date.now()},
    cartId:{type:Schema.Types.ObjectId,ref:'Cart'},
    payId:{type:String},
}
)

export const Order: Model<IOrder> = model('Order', OrderSchema)
