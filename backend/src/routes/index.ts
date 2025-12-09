import { errorHandler } from "../middleware/errorHandler";
import recordsRouter from "./records";
import accountsRouter from "./accounts";
import type { Express } from "express";

export function setupRoutes(app: Express) {
	app.use("/api/records", recordsRouter);
	app.use("/api/accounts", accountsRouter);
	app.use(errorHandler);
}
