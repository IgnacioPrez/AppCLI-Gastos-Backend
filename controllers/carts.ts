import { Request, Response } from 'express'
import { Products } from '../model/products.model'
import { Cart, ICart } from '../model/cart.model'
import { validateProduct } from '../helpers/validationsRoutes'

export const addInCart = async (req: Request, res: Response) => {
  const { _id } = req.body.userConfirmed
  const { productId, quantity } = req.body

  try {
    const product: any = await Products.findById(productId)
    await validateProduct(productId, res)

    const myCart: any = await Cart.findOne({ userId: _id, statusPaid: false })

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
      userId: _id,
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
  }
}

export const getCart = async (req: Request, res: Response) => {
  const { _id } = req.body.userConfirmed

  try {
    const cart: ICart | null = await Cart.findOne({ userId: _id, statusPaid: false }).populate('items.productId')
    if (!cart) {
      return res.status(400).json({ message: 'No tiene ningún artículo en su carrito.' })
    }

    res.json({
      cart,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Error al obtener el carrito.' })
  }
}

export const deleteFromCart = async (req: Request, res: Response): Promise<void> => {
  const { _id } = req.body.userConfirmed
  const { productId } = req.params
  try {
    const product: any = await Products.findOne({ _id: productId })

    if (!productId) {
      res.status(401).json({
        message: 'Debe proporcionar un ID del producto ',
      })
      return
    }

    const myCart: any = await Cart.findOne({ userId: _id })
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

      res.status(200).json({
        message: `Se eliminó el siguiente artículo de su carrito: ${product?.title}`,
      })
      return
    } else {
      res.status(401).json({
        message: 'No existe este producto en su carrito',
      })
    }
  } catch (err) {
    console.log(err)
  }
}

export const clearCart = async (req: Request, res: Response): Promise<void> => {
  const dateOfUser = req.body.userConfirmed

  try {
    const myCart: any = await Cart.find({ userId: dateOfUser._id })

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
