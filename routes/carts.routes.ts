import { Router } from 'express'
import { addInCart, clearCart, deleteFromCart, getCart } from '../controllers/carts'
import { validateJWT } from '../middlewares/validateJWT'
import { collectBugs } from '../middlewares/collectBugs'
import { isVerified } from '../middlewares/validateVerified'
import { check } from 'express-validator'

const router = Router()

router.post(
  '/addInCart',
  [check('quantity', 'Debe ingresar las cantidades del producto').not().isEmpty(), collectBugs],
  addInCart
)

router.get('/', getCart)

router.delete('/clearCart', clearCart)

router.post('/deletefromCartById/:productId', deleteFromCart)

export default router
