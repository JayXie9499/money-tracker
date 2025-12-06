import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import config from "../core/config";
import type { Express } from "express";

export function setupMiddleware(app: Express) {
	app.use(
		cors({
			origin: config.CORS_ORIGINS,
			credentials: true
		})
	);
	app.use(
		helmet({
			contentSecurityPolicy: {
				directives: {
					defaultSrc: ["'self'"],
					styleSrc: ["'self'"],
					scriptSrc: ["'self'"],
					imgSrc: ["'self'", "data:"],
					fontSrc: ["'self'"]
				}
			}
		})
	);
	app.use(compression());
	app.use(express.json({ limit: "50kb" }));
}
