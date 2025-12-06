import express from "express";
import { setupMiddleware } from "./middleware";
import config from "./core/config";
import logger from "./core/logger";

const app = express();

setupMiddleware(app);

app.listen(config.PORT, () => {
	logger.info(`Server is running on port ${config.PORT}`);
});

export default app;
