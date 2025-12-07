import prisma from "../core/database";
import logger from "../core/logger";
import { CreateRecordSchema, EditRecordSchema } from "../schemas";
import { parseUserData } from "../utils/parseUserData";
import type { Request, Response } from "express";

export async function listRecords(req: Request, res: Response) {
	const { year, month } = req.query;

	if (typeof year !== "string" || typeof month !== "string") {
		res.status(400).json({ message: "Invalid query parameters" });
		return;
	}

	try {
		const records = await prisma.record.findMany({
			where: {
				date: {
					gte: new Date(parseInt(year), parseInt(month) - 1, 1),
					lt: new Date(parseInt(year), parseInt(month), 1)
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
				err,
				...parseUserData(req)
			}
		});
		res.sendStatus(500);
	}
}

export async function createRecord(req: Request, res: Response) {
	const recordData = CreateRecordSchema.safeParse(req.body);

	if (!recordData.success) {
		res.status(400).json({ message: "Invalid record data" });
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
				err,
				...parseUserData(req)
			}
		});
		res.sendStatus(500);
	}
}

export async function deleteRecord(req: Request, res: Response) {
	const { id } = req.params;

	if (isNaN(parseInt(id))) {
		res.status(400).json({ message: "Invalid record ID" });
		return;
	}

	try {
		const recordExists = await prisma.record.findUnique({
			where: { id: parseInt(id) }
		});

		if (!recordExists) {
			res.status(404).json({ message: "Record not found" });
			return;
		}

		await prisma.record.delete({
			where: { id: parseInt(id) }
		});
		res.status(200).json({
			message: "Record deleted successfully"
		});
	} catch (err) {
		logger.log({
			level: "error",
			message: "Error deleting record",
			details: {
				err,
				...parseUserData(req)
			}
		});
		res.sendStatus(500);
	}
}

export async function editRecord(req: Request, res: Response) {
	const { id } = req.params;

	if (isNaN(parseInt(id))) {
		res.status(400).json({ message: "Invalid record ID" });
		return;
	}

	const recordData = EditRecordSchema.safeParse(req.body);

	if (!recordData.success) {
		res.status(400).json({ message: "Invalid record data" });
		return;
	}

	try {
		const recordExists = await prisma.record.findUnique({
			where: { id: parseInt(id) }
		});

		if (!recordExists) {
			res.status(404).json({ message: "Record not found" });
			return;
		}

		const updatedRecord = await prisma.record.update({
			where: { id: parseInt(id) },
			data: { ...recordData.data }
		});

		res.status(200).json({
			message: "Record updated successfully",
			data: updatedRecord
		});
	} catch (err) {
		logger.log({
			level: "error",
			message: "Error updating record",
			details: {
				err,
				...parseUserData(req)
			}
		});
		res.sendStatus(500);
	}
}
