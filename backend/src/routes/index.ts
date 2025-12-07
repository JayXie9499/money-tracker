import recordsRouter from "./records";
import type { Express } from "express";

export function setupRoutes(app: Express) {
	app.use("/records", recordsRouter);
}
