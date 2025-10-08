import { Router } from "express";
import { createContactController, deleteContactController, getContactsController, getContactsIdController, patchContactController } from "../controllers/contacts.js";
import { validateBody } from "../middlewares/validateBody.js";
import { isValidId } from "../middlewares/isValidId.js";
import { createContactsPatchSchema, createContactsSchema } from "../validation/contacts.js";
import { authenticate } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";
// import { ctrlWrapper } from "../utilits/ctrlWrapper.js";
// import { validateObjectId } from "../middlewares/validateObjectId.js";

const router = Router();

router.use(authenticate);
router.get('/',(getContactsController));
router.get('/:contactId', isValidId, (getContactsIdController));
router.post('/', upload.single('photo'),validateBody(createContactsSchema), createContactController);
router.patch('/:contactId', upload.single('photo'), isValidId, validateBody(createContactsPatchSchema), patchContactController);
router.delete('/:contactId', isValidId, deleteContactController);
export default router;



