
import { Request, Response } from 'express'
import { ObjectId } from 'mongoose'
import { Orders, OrdesData } from '../model/orders.model'

export const getOrder = async (req:Request,res:Response) : Promise<void> => {
    const userID :ObjectId = req.body.userConfirmed._id
    
    const consult = {user:userID}
    const orders = await Orders.find({consult})

    res.json({
        data:[...orders]
    })
}

export const createOrders = async (req:Request,res:Response): Promise<void> => {
    const userID :ObjectId = req.body.userConfirmed._id

    const orderData: OrdesData = req.body

    const data = {
        ...orderData,
        user:userID,
        createAt: new Date(),
        status:"pending"
    }

    const order = new Orders(data)

    await order.save()

    res.status(201).json({
        order
    })
}