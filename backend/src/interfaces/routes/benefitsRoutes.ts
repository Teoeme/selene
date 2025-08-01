import { Router } from "express";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { BenefitsController } from "../controllers/BenefitsController";

const router = Router();
const authMiddleware = new AuthMiddleware();

const benefitsController = new BenefitsController();

router.use(authMiddleware.authenticate); //todas las rutas de este archivo requieren autenticación

router.get('/', benefitsController.listBenefits);

export default router;