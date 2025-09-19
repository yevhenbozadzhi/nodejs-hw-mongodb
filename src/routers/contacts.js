import { Router } from "express";
import { createContactController, deleteContactController, getContactsController, getContactsIdController, patchContactController } from "../controllers/contacts.js";
import { ctrlWrapper } from "../utilits/ctrlWrapper.js";

const router = Router();

router.get('/', ctrlWrapper(getContactsController));
router.get('/:contactId', ctrlWrapper(getContactsIdController));
router.post('/', ctrlWrapper(createContactController));
router.patch('/:contactId', ctrlWrapper(patchContactController));
router.delete('/:contactId', ctrlWrapper(deleteContactController))
export default router;