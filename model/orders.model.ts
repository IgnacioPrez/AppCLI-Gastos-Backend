import { Model,model,Types,Schema, ObjectId } from "mongoose";

interface ShippingDetails {
    name:string,
    cellphone:string
    location:string
    addres:string
}


export interface OrdesData {
    createAT:Date
    user: Types.ObjectId
    price:number
    shippingCost:number
    cartId:ObjectId
    shippingDetails: ShippingDetails
    status:string
    total:number
}

export const OrdersSchema = new Schema<OrdesData>({
    createAT:{
        type:Date,
        default:Date.now()
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        require:true
    },
    price:{
        type:Number,
        required:true,
    },
    shippingCost:{
        type:Number,
    },
    cartId:[{type:Schema.Types.ObjectId,ref:'Cart'}],
    shippingDetails:{
        name:{
            type:String,
            required:true
        },
        cellphone:{
            type:String,
            required:true
        },
        location:{
            type:String,
            required:true
        },
        addres:{
            type:String,
            required:true
        }

    },
    status:{
        type:String,
        required:true
    },
    total:{
        type:Number,
        required:true
    }
    
})

export const Orders: Model<OrdesData> = model<OrdesData>('Order',OrdersSchema)

