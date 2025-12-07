import logger from "../core/logger";
import { parseUserData } from "../utils/parseUserData";
import type { Request, Response, NextFunction } from "express";

export function errorHandler(
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (res.headersSent) {
		next(err);
		return;
	}

	logger.log({
		level: "error",
		message: "Unknown error occurred",
		details: {
			err,
			...parseUserData(req)
		}
	});
	res.sendStatus(500);
}
