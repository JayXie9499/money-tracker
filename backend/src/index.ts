import express from "express";
import config from "./core/config";
import logger from "./core/logger";
import prisma from "./core/database";
import { setupMiddleware } from "./middleware";
import { setupRoutes } from "./routes";

const app: express.Express = express();
const shutdown = async () => {
	await prisma.$disconnect();
	process.exit(0);
};

setupMiddleware(app);
setupRoutes(app);

app.listen(config.PORT, () => {
	logger.info(`Server is running on port ${config.PORT}`);
});

process.on("SIGTERM", () => shutdown());
process.on("SIGINT", () => shutdown());

export default app;
