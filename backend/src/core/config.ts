import dotenv from "dotenv";
import * as z from "zod";

dotenv.config();

const URL_REGEX =
	/^https?:\/\/((?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|(?:\d{1,3}\.){3}\d{1,3}|localhost)(?::\d+)?(\/[a-zA-Z0-9-._~:!$&'()*+,;=%@]*)?$/;

const config = z.object({
	NODE_ENV: z.enum(["dev", "prod", "test"]).default("dev"),
	PORT: z
		.string()
		.default("3000")
		.transform((val) => parseInt(val, 10))
		.refine((val) => val >= 1 && val <= 65535, {
			error: "PORT must be between 1 and 65535"
		}),
	DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
	CORS_ORIGINS: z
		.string()
		.min(1, "CORS_ORIGINS is required")
		.transform((val) => val.split(",").map((origin) => origin.trim()))
		.refine((origins) => origins.every((origin) => origin.match(URL_REGEX)), {
			error: "CORS_ORIGINS must be a comma-separated list of valid URLs"
		})
});

export default config;
