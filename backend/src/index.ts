import express from "express";
import { setupMiddleware } from "./middleware";
import config from "./core/config";
import logger from "./core/logger";
import prisma from "./core/database";

const app = express();
const shutdown = async () => {
	await prisma.$disconnect();
	process.exit(0);
};

setupMiddleware(app);

app.listen(config.PORT, () => {
	logger.info(`Server is running on port ${config.PORT}`);
});

process.on("SIGTERM", () => shutdown());
process.on("SIGINT", () => shutdown());

export default app;
