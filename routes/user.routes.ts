import { Router } from 'express'
import { login, profile, register, verifyUser } from '../controllers/auth'
import { check } from 'express-validator'
import { collectBugs } from '../middlewares/collectBugs'
import { existEmail } from '../helpers/validationsDB'
import { validateJWT } from '../middlewares/validateJWT'
import { isVerified } from '../middlewares/validateVerified'

const router = Router()

router.post(
  '/register',
  [
    check('fullName', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El correo es obligatorio').isEmail(),
    check('dni', 'El DNI es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe ser de 6 caracteres como minimo').isLength({
      min: 6,
    }),
    check('email').custom(existEmail),
    collectBugs,
  ],
  register
)


router.post(
  '/login',
  [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña debe ser de 6 caracteres como minimo').isLength({
      min: 6,
    }),
    collectBugs,
  ],
  login
)

router.post('/profile', [
  validateJWT,
  isVerified,
  collectBugs
], profile)




router.patch(
  '/verify',
  [
    check('email', 'El email es requerido').isEmail(),
    check('code', 'El código de verificación es requerido').not().isEmpty(),
    collectBugs,
  ],
  verifyUser
)


export default router
