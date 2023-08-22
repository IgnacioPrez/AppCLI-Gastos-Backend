import { Router } from 'express'
import { addInCart, clearCart, deleteFromCart, getCart } from '../controllers/carts'
import { validateJWT } from '../middlewares/validateJWT'
import { collectBugs } from '../middlewares/collectBugs'
import { isVerified } from '../middlewares/validateVerified'
import { check } from 'express-validator'

const router = Router()

router.post(
  '/addInCart',
  [
    validateJWT,
    isVerified,
    check('quantity', 'Debe ingresar las cantidades del producto').not().isEmpty(),
    collectBugs,
  ],
  addInCart
)

router.get('/', [validateJWT, isVerified, collectBugs], getCart)

router.delete(
  '/clearCart',

  [validateJWT, isVerified, collectBugs],
  clearCart
)

router.patch('/deletefromCartById/:productId', [validateJWT, isVerified, collectBugs], deleteFromCart)

export default router
