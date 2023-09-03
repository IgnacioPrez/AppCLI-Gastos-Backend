import { Router } from 'express'
import { createPay, receiveWebhook } from '../controllers/payment'
import { validateJWT } from '../middlewares/validateJWT'
import { isVerified } from '../middlewares/validateVerified'
import { collectBugs } from '../middlewares/collectBugs'
import { check } from 'express-validator'

const router = Router()

router.post(
  '/create-payment',
  [
    validateJWT, 
    isVerified,
    check('email', 'El correo debe ser válido').isEmail(),
    check('surname', 'El apellido es requerido').not().isEmpty(),
    check('name', 'El nombre es requerido').not().isEmpty(),
    check('dni', 'Debe proporcionar un DNI válido').not().isEmpty(),
    check('streetName', 'La calle de su vivienda es obligatoria').not().isEmpty(),
    check('streetNumber', 'El número de calle es obligatorio').not().isEmpty(),
    check('zipCode', 'Se requiere un código postal').not().isEmpty(),
    collectBugs],
  createPay
)

router.get('/succes', (req, res) => res.send('succes'))
router.get('/failure', (req, res) => res.send('failure'))
router.get('/pending', (req, res) => res.send('pending'))

router.post('/webhook/:id', receiveWebhook)

export default router
