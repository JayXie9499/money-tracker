import { Router } from "express";
import {
	createAccount,
	deleteAccount,
	editAccount,
	listAccounts
} from "../controllers/accountsController";

const router: Router = Router();

router.get("/", listAccounts);

router.post("/", createAccount);

router.delete("/:id", deleteAccount);

router.put("/:id", editAccount);

export default router;
