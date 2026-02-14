import { Router } from "express";
import { createContactController, deleteContactController, getContactsController, getContactsIdController, patchContactController } from "../controllers/contacts.js";
// import { ctrlWrapper } from "../utilits/ctrlWrapper.js";
// import { validateObjectId } from "../middlewares/validateObjectId.js";

const router = Router();

router.get('/', (getContactsController));
router.get('/:contactId',  (getContactsIdController));
router.post('/', createContactController);
router.patch('/:contactId',  patchContactController);
router.delete('/:contactId',  deleteContactController);
export default router;