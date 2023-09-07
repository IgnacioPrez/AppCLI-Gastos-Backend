import { Request, Response } from 'express'
import { IProducts, Products } from '../model/products.model'
import { deleteImage, uploadImage } from '../helpers/cloudinary'
import fs from 'fs-extra'
import { ALL_FILTERS } from '../helpers/constants'

export const createProducts = async (req: Request, res: Response) => {
  const productsData: IProducts = req.body
  const existPathImage: any = req.files?.image

  if (!existPathImage) {
    res.status(400).json({
      message: 'El archivo no contiene una imagen',
    })
    return
  }

  try {
    const products = new Products(productsData)
    const productFound = await Products.findOne({ title: products.title })

    if (productFound) return res.status(400).json({ message: 'El producto ya existe' })

    if (!products) return res.status(400).json({ message: 'Error al crear el producto' })

    if (existPathImage) {
      const result = await uploadImage(existPathImage.tempFilePath)
      products.image = {
        public_id: result.public_id,
        url: result.secure_url,
      }
      await fs.unlink(existPathImage.tempFilePath)
    }

    await products.save()
    res.json({
      message: 'Producto creado correctamente',
      products,
    })
  } catch (err) {
    throw new Error(`Ocurrio un error al crear el producto: --> ${err}`)
  }
}

export const getProducts = async (req: Request, res: Response) => {
  const products: IProducts[] = await Products.find()
  if (!products) return res.status(400).json({ message: 'Error al obtener los productos' })
  res.json({
    products,
  })
}

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Products.findByIdAndDelete(req.params.id)
    if (!product) {
      res.status(401).json({
        message: 'El producto no existe',
      })
      return
    }
    if (product.image?.public_id) {
      deleteImage(product.image.public_id)
      res.status(200).json({
        message: 'Eliminado correctamente',
      })
      return
    }
  } catch (err) {
    console.log(`Error al eliminar el producto u/o imagen: --> ${err}`)
  }
}

export const filterProducts = async (req: Request, res: Response): Promise<void> => {
  const { filterName }: any = req.query
  const resultOfFilters = (filter?: string) => filter && Products.find({ nameCategory: filter })

  try {
    const filterFound = Object.values(ALL_FILTERS).some((filter) => filter === filterName)
    if (!filterFound) {
      res.status(401).json({
        message: 'El filtro es incorrecto',
      })
      return
    }
    const filterProducts = await resultOfFilters(filterName)
    res.status(201).json({
      filterProducts,
    })
  } catch (err) {
    console.log(err)
  }
}
