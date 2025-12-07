import * as z from "zod";
import { RecordType } from "./generated/prisma/enums";

const URL_REGEX =
	/^(?:https?:\/\/)?((?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|(?:\d{1,3}\.){3}\d{1,3}|localhost)(?::\d+)?(\/[a-zA-Z0-9-._~:!$&'()*+,;=%@]*)?$/;
const ISO_REGEX =
	/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|(?:[+-]\d{2}:\d{2}))$/;

export const ConfigSchema = z.object({
	NODE_ENV: z.enum(["dev", "prod", "test"]).default("dev"),
	PORT: z
		.string()
		.default("3000")
		.transform((val) => parseInt(val, 10))
		.refine((val) => val >= 1024 && val <= 65535, {
			error: "PORT must be between 1024 and 65535"
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

export const CreateRecordSchema = z.object({
	type: z.enum(RecordType),
	accountId: z.number().int(),
	amount: z.number().positive(),
	date: z
		.string()
		.refine(
			(date) => ISO_REGEX.test(date) && !isNaN(new Date(date).getTime()),
			{ error: "Invalid ISO date string" }
		)
});

export const EditRecordSchema = z.object({
	type: z.enum(RecordType).optional(),
	accountId: z.number().int().optional(),
	amount: z.number().positive().optional(),
	date: z
		.string()
		.refine(
			(date) => ISO_REGEX.test(date) && !isNaN(new Date(date).getTime()),
			{ error: "Invalid ISO date string" }
		)
		.optional()
});
