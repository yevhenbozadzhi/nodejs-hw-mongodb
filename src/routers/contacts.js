import { Router } from "express";
import { createContactController, deleteContactController, getContactsController, getContactsIdController, patchContactController } from "../controllers/contacts.js";
import { validateBody } from "../middlewares/validateBody.js";
import { isValidId } from "../middlewares/isValidId.js";
import { createContactsSchema } from "../validation/contacts.js";
// import { ctrlWrapper } from "../utilits/ctrlWrapper.js";
// import { validateObjectId } from "../middlewares/validateObjectId.js";

const router = Router();

router.get('/',(getContactsController));
router.get('/:contactId', isValidId, (getContactsIdController));
router.post('/', validateBody(createContactsSchema), createContactController);
router.patch('/:contactId', isValidId,  patchContactController);
router.delete('/:contactId', isValidId,  deleteContactController);
export default router;