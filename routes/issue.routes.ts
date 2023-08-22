import { Router } from "express";
import { newIssue } from "../controllers/issue";
import { validateJWT } from "../middlewares/validateJWT";
import { isAdmin } from "../middlewares/rolValidate";
import { collectBugs } from "../middlewares/collectBugs";
import { check } from "express-validator";

const router = Router()

router.post('/',[
    validateJWT,
    isAdmin,
    check("title","El título es obligatorio").not().isEmpty(),
    check("description","La descripción es obligatoria").not().isEmpty(),
    check("priority","La prioridad es obligatoria").not().isEmpty(),
    collectBugs
],newIssue)

export default router