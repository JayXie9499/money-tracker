import dotenv from "dotenv";
import * as z from "zod";

dotenv.config();

const config = z
	.object({
		NODE_ENV: z.enum(["dev", "prod", "test"]).default("dev"),
		PORT: z
			.string()
			.default("3000")
			.transform((val) => parseInt(val)),
		DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
		CORS_ORIGINS: z
			.string()
			.min(1, "CORS_ORIGINS is required")
			.transform((val) =>
				val
					.split(",")
					.map((origin) => origin.trim())
					.filter((origin) => origin.length > 0)
			)
	})
	.parse(process.env);

export default config;
