import { Router } from "express";
import {
	createRecord,
	deleteRecord,
	editRecord,
	listRecords
} from "../controllers/recordsController";

const router = Router();

router.get("/", listRecords);

router.post("/", createRecord);

router.delete("/:id", deleteRecord);

router.put("/:id", editRecord);

export default router;
