import { Router } from "express";
import { getGoogleOAuthUrlController, loginUserController, loginWithGoogleController, logoutUserController, refreshUsersSessionController, registerUserController, requestResetEmailController, resetPasswordController } from "../controllers/auth.js";
import { validateBody } from "../middlewares/validateBody.js";
import { loginUserSchema, loginWithGoogleOAuthShema, registerUserSchema, requestResetEmailSchema, resetPasswordSchema } from "../validation/auth.js";


const router = Router();
router.post('/register', validateBody(registerUserSchema), registerUserController);
router.post('/login', validateBody(loginUserSchema), loginUserController);
router.post('/refresh', refreshUsersSessionController);
router.post('/logout', logoutUserController);
router.post('/send-reset-email', validateBody(requestResetEmailSchema), requestResetEmailController);
router.post('/reset-pwd', validateBody(resetPasswordSchema), resetPasswordController);
router.get('/get-oauth-url', getGoogleOAuthUrlController);
router.post('/confirm-oauth', validateBody(loginWithGoogleOAuthSchema), loginWithGoogleController);


export default router;