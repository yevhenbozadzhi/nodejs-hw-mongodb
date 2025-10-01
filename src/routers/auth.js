import { Router } from "express";
import { loginUserController, logoutUserController, refreshUsersSessionController, registerUserController } from "../controllers/auth.js";
import { validateBody } from "../middlewares/validateBody.js";
import { loginUserSchema, registerUserSchema } from "../validation/auth.js";

const router = Router();
router.post('/register', validateBody(registerUserSchema), registerUserController);
router.post('/login', validateBody(loginUserSchema), loginUserController);
router.post('/refresh', refreshUsersSessionController);
router.post('/logout', logoutUserController);

export default router;