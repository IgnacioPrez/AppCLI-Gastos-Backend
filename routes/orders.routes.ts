import { Router } from "express";
import { createOrders, getOrder } from "../controllers/orders";
import { collectBugs } from "../middlewares/collectBugs";
import { validateJWT } from "../middlewares/validateJWT";
import { isVerified } from "../middlewares/validateVerified";
import { check } from "express-validator";

const router = Router()

router.get('/',[
   validateJWT,
    collectBugs
],getOrder)

router.post('/',
[
    validateJWT,
    isVerified,
    check("price","El precio es obligatorio").not().isEmpty(),
    check("shippingCost","El costo de envío es obligatorio").not().isEmpty(),
    check("total","El total es obligatorio").not().isEmpty(),
    check("shippingDetails","Los detalles de envío son obligatorios").not().isEmpty(),
    check("items","El array de productos es obligatorio").not().isEmpty(),
    collectBugs
],
createOrders
)

export default router