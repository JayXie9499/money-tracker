import type { Request } from "express";

export function parseUserData(req: Request) {
	return {
		userAgent: req.get("User-Agent"),
		path: req.path,
		method: req.method
	};
}
