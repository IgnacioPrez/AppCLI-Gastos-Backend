import { Request, Response } from 'express'
import { Products } from '../model/products.model'
import { Cart, ICart } from '../model/cart.model'
import { validateProduct } from '../helpers/validationsRoutes'
import jwt, { JwtPayload } from 'jsonwebtoken'

export const addInCart = async (req: Request, res: Response) => {
  const { productId, quantity } = req.body
  const authorizationHeader = req.headers['authorization'] as string

  try {
    const token = authorizationHeader.split(' ')[1]
    const product: any = await Products.findById(productId)
    const payload = jwt.verify(token, process.env.SECRET_PASSWORD as string) as JwtPayload
    await validateProduct(productId, res)

    const myCart: any = await Cart.findOne({ userId: payload.id, statusPaid: false })

    const productInCart: any = myCart?.items.find((item: any) => item.productId.toString() === productId)

    if (myCart || productInCart) {
      await Cart.findByIdAndUpdate(
        myCart._id,
        {
          $push: {
            items: { productId: product, quantity },
          },
          $inc: {
            totalPrice: product.price,
          },
        },
        { new: true }
      )
      res.status(200).json({
        message: `Se añadió una nueva unidad del producto ${product.title}`,
      })
      return
    }

    const cart = new Cart({
      userId: payload.id,
      items: {
        productId: product,
        quantity,
      },
      totalPrice: product.price,
      statusPaid: false,
    })
    await cart.save()

    res.status(200).json({
      message: 'Se añadió a tu carrito',
      cart,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({message:'Error en el servidor'})
  }
}

export const getCart = async (req: Request, res: Response) => {
  const authorizationHeader = req.headers['authorization'] as string
  try {
    const token = authorizationHeader.split(' ')[1]
    const payload = jwt.verify(token as string, process.env.SECRET_PASSWORD as string) as JwtPayload
    const cart: ICart | null = await Cart.findOne({ userId: payload.id, statusPaid: false }).populate('items.productId')
    if (!cart) {
      return res.status(400).json({ message: 'No tiene ningún artículo en su carrito.' })
    }

    res.json({
      cart,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Error en el servidor' })
  }
}

export const deleteFromCart = async (req: Request, res: Response): Promise<void> => {
  const { productId } = req.params
  const authorizationHeader = req.headers['authorization'] as string
  console.log(req.headers)

  try {
    const token = authorizationHeader.split(' ')[1]
    const product: any = await Products.findOne({ _id: productId })
    if (!productId) {
      res.status(401).json({
        message: 'Debe proporcionar un ID del producto ',
      })
      return
    }

    const payload = jwt.verify(token as string, process.env.SECRET_PASSWORD as string) as JwtPayload
    const myCart: any = await Cart.findOne({ userId: payload.id, statusPaid: false })
    const productInCart = myCart.items
      .map((el: any) => el.productId.toString())
      .findIndex((el: string) => el === productId)

    if (productInCart !== -1) {
      myCart.items.splice(productInCart, 1)
      await Cart.findByIdAndUpdate(
        myCart._id,
        {
          $inc: {
            totalPrice: -product.price,
          },
        },
        { new: true }
      )
      await myCart.save()

      res.status(200)
      return
    } else {
      res.status(401).json({
        message: 'No existe este producto en su carrito',
      })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: err,
    })
  }
}

export const clearCart = async (req: Request, res: Response): Promise<void> => {
  const {_id} = req.body.userConfirmed

  try {
    const myCart: any = await Cart.find({ userId: _id })

    if (myCart.length === 0) {
      res.status(401).json({
        message: 'No hay productos para eliminar en el carrito',
      })
      return
    }

    const newCart = await myCart.filter((el: any) => !el.statusPaid)
    if (newCart) {
      const cartId = myCart[0]._id.toString()
      await Cart.findByIdAndDelete(cartId)
      return
    }
    const cartId = myCart[0]._id.toString()

    await Cart.findByIdAndDelete(cartId)

    res.status(201).json({
      message: 'Su carrito se eliminó exitosamente',
    })
  } catch (err) {
    console.log(err)
  }
}
