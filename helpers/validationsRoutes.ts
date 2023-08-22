import { Cart } from "../model/cart.model"
import { Products } from "../model/products.model"
import { Response } from "express"

export const validateProduct = async (productId: string, res: Response): Promise<void> => {
    const productExists = await Products.exists({ _id: productId })
    if (!productExists) {
      res.status(400).json({ message: 'Error al obtener el producto' })
      return
    }
  }

export const validateProductInCart = async (id:string,res:Response) :Promise<void> => {
  const productExists = await Cart.exists({'items.productId':id})

  if(!productExists){
    res.status(400).json({
      message:'El producto no existe en su carrito'
    })
    return
  }
}