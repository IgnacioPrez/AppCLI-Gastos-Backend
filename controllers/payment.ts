import { Request, Response } from 'express'
import mercadopago from 'mercadopago'
import { Cart } from '../model/cart.model'
import { User } from '../model/user.model'
import { Order } from '../model/order.model'

export const createPay = async (req: Request, res: Response): Promise<void> => {
  const { _id } = req.body.userConfirmed
  const { email, dni, streetName, streetNumber, zipCode, name, surname } = req.body

  try {
    const cart: any = await Cart.findOne({ userId: _id }).populate('items.productId')

    mercadopago.configure({
      access_token: process.env.TOKEN_MP_API as string,
    })

    const data = await mercadopago.preferences.create({
      items: cart.items.map((item: any) => ({
        title: item.productId.title,
        quantity: item.quantity,
        currency_id: 'ARS',
        unit_price: item.productId.price,
      })),
      payer: {
        name,
        surname,
        email: email,
        identification: {
          type: 'dni',
          number:String(dni),
        },
        address: {
          street_name: streetName,
          street_number: streetNumber,
          zip_code: zipCode,
        },
      },
      back_urls: {
        success: `https://app-cli-gastos-backend.vercel.app/pay/succes`,
        failure: `https://app-cli-gastos-backend.vercel.app/failure`,
        pending: `https://app-cli-gastos-backend.vercel.app/pending`,
      },
      notification_url: `https://app-cli-gastos-backend.vercel.app/pay/webhook/${_id}`,
    })


    res.status(201).json(data.body)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Error en el servidor',
    })
  }
}

export const receiveWebhook = async (req: Request, res: Response) => {
  const payment: any = req.query
  const { id } = req.params
  try {
    const data = await mercadopago.payment.findById(payment['data.id'])
    const cart: any = await Cart.findOne({ userId: id, statusPaid: false })
    const existOrder = await Order.findOne({ cartId: cart })

    if(existOrder){
      res.status(401).json({
        message:'Esta compra ya fue efectuada '
      })
      return
    }

    if (payment.type === 'payment') {
        const order = new Order({
          status: true,
          createdAt: Date.now(),
          payId: payment['data.id'],
          cartId: cart,
        })
        await order.save()
        await Cart.findOneAndUpdate({ userId: id, statusPaid: false }, { statusPaid: true }, { new: true })

        res.status(200).json({
          message: 'Su compra se concreto correctamente',
        })
      return
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'Error en el servidor',
    })
  }
}
