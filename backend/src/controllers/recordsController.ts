import { treeifyError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import prisma from "../core/database";
import logger from "../core/logger";
import { CreateRecordSchema, EditRecordSchema } from "../schemas";
import { parseUserData, isBigInt } from "../utils";
import type { Request, Response } from "express";

export async function listRecords(req: Request, res: Response) {
	const { year, month } = req.query;
	const yearNum = Number(year);
	const monthNum = Number(month);

	if (
		!Number.isInteger(yearNum) ||
		!Number.isInteger(monthNum) ||
		yearNum < 1970 ||
		monthNum < 1 ||
		monthNum > 12
	) {
		res.status(400).json({ message: "Invalid query parameters" });
		return;
	}

	try {
		const records = await prisma.record.findMany({
			where: {
				date: {
					gte: new Date(yearNum, monthNum - 1, 1),
					lt: new Date(yearNum, monthNum, 1)
				}
			}
		});

		res.status(200).json({
			message: "Records fetched successfully",
			data: records
		});
	} catch (err) {
		logger.log({
			level: "error",
			message: "Error fetching records",
			details: {
				error: err instanceof Error ? err.message : String(err),
				stack: err instanceof Error ? err.stack : undefined,
				raw: err,
				...parseUserData(req)
			}
		});
		res.sendStatus(500);
	}
}

export async function createRecord(req: Request, res: Response) {
	const recordData = CreateRecordSchema.safeParse(req.body);

	if (!recordData.success) {
		res.status(400).json({
			message: "Invalid record data",
			data: treeifyError(recordData.error).errors
		});
		return;
	}

	try {
		const record = await prisma.record.create({
			data: { ...recordData.data }
		});

		res.status(201).json({
			message: "Record created successfully",
			data: record
		});
	} catch (err) {
		logger.log({
			level: "error",
			message: "Error creating record",
			details: {
				error: err instanceof Error ? err.message : String(err),
				stack: err instanceof Error ? err.stack : undefined,
				raw: err,
				...parseUserData(req)
			}
		});
		res.sendStatus(500);
	}
}

export async function deleteRecord(req: Request, res: Response) {
	const { id } = req.params;

	if (!isBigInt(id)) {
		res.status(400).json({ message: "Invalid record ID" });
		return;
	}

	try {
		await prisma.record.delete({
			where: { id: BigInt(id) }
		});

		res.status(200).json({
			message: "Record deleted successfully"
		});
	} catch (err) {
		if (err instanceof PrismaClientKnownRequestError && err.code === "P2025") {
			res.status(404).json({ message: "Record not found" });
			return;
		}

		logger.log({
			level: "error",
			message: "Error deleting record",
			details: {
				error: err instanceof Error ? err.message : String(err),
				stack: err instanceof Error ? err.stack : undefined,
				raw: err,
				...parseUserData(req)
			}
		});
		res.sendStatus(500);
	}
}

export async function editRecord(req: Request, res: Response) {
	const { id } = req.params;

	if (!isBigInt(id)) {
		res.status(400).json({ message: "Invalid record ID" });
		return;
	}

	const recordData = EditRecordSchema.safeParse(req.body);

	if (!recordData.success) {
		res.status(400).json({
			message: "Invalid record data",
			data: treeifyError(recordData.error).errors
		});
		return;
	}

	try {
		const updatedRecord = await prisma.record.update({
			where: { id: BigInt(id) },
			data: { ...recordData.data }
		});

		res.status(200).json({
			message: "Record updated successfully",
			data: updatedRecord[0]
		});
	} catch (err) {
		if (err instanceof PrismaClientKnownRequestError && err.code === "P2025") {
			res.status(404).json({ message: "Record not found" });
			return;
		}

		logger.log({
			level: "error",
			message: "Error updating record",
			details: {
				error: err instanceof Error ? err.message : String(err),
				stack: err instanceof Error ? err.stack : undefined,
				raw: err,
				...parseUserData(req)
			}
		});
		res.sendStatus(500);
	}
}
