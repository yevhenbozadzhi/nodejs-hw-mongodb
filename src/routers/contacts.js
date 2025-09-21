import { Router } from "express";
import { createContactController, deleteContactController, getContactsController, getContactsIdController, patchContactController } from "../controllers/contacts.js";
import { ctrlWrapper } from "../utilits/ctrlWrapper.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";

const router = Router();

router.get('/', ctrlWrapper(getContactsController));
router.get('/:contactId', validateObjectId('contactId'), ctrlWrapper(getContactsIdController));
router.post('/', ctrlWrapper(createContactController));
router.patch('/:contactId', validateObjectId('contactId'), ctrlWrapper(patchContactController));
router.delete('/:contactId', validateObjectId('contactId'), ctrlWrapper(deleteContactController))
export default router;