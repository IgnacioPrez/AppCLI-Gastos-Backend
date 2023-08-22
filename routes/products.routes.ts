import { Router } from 'express'
import { createProducts, deleteProduct, filterProducts, getProducts } from '../controllers/products'
import { check } from 'express-validator'
import { collectBugs } from '../middlewares/collectBugs'

const router = Router()

router.post(
  '/createProducts',
  [
    check('title',"El título es requerido.").not().isEmpty(),
    check('price','El producto debe tener un precio').isNumeric().not().isEmpty(),
    check('description', 'El producto debe ser enviado con una descripción').not().isEmpty(),
    check('nameCategory','El producto debe pertenecer a una categoría').not().isEmpty(),
    collectBugs
  ]
  ,
  createProducts
)
router.get('/', getProducts)


router.delete('/deleteProduct/:id',deleteProduct)
router.get('/filter',filterProducts)

export default router
