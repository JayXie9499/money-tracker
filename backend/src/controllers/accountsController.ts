import { treeifyError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import prisma from "../core/database";
import logger from "../core/logger";
import { AccountSchema } from "../schemas";
import { parseUserData, serializeData } from "../utils";
import type { Request, Response } from "express";
import type { Account } from "../generated/prisma/client";

export async function listAccounts(req: Request, res: Response) {
	try {
		const accounts = await prisma.$queryRaw<
			(Account & { totalIncome: string; totalExpense: string })[]
		>`SELECT
				a.*,
				COALESCE(SUM(CASE WHEN r.type = 'INCOME' THEN r.amount ELSE 0 END), 0) AS "totalIncome",
				COALESCE(SUM(CASE WHEN r.type = 'EXPENSE' THEN r.amount ELSE 0 END), 0) AS "totalExpense"
			FROM
				"Account" a
			LEFT JOIN
				"Record" r ON a.id = r."accountId"
			GROUP BY
				a.id
			ORDER BY
				a.id;`;

		res.status(200).json({
			message: "Accounts fetched successfully",
			data: serializeData(accounts)
		});
	} catch (err) {
		logger.log({
			level: "error",
			message: "Error fetching accounts",
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

export async function createAccount(req: Request, res: Response) {
	const accountData = AccountSchema.safeParse(req.body);

	if (!accountData.success) {
		res.status(400).json({
			message: "Invalid account data",
			errors: treeifyError(accountData.error).errors
		});
		return;
	}

	try {
		const account = await prisma.account.create({
			data: accountData.data
		});

		res.status(201).json({
			message: "Account created successfully",
			data: serializeData({
				...account,
				totalIncome: "0",
				totalExpense: "0"
			})
		});
	} catch (err) {
		logger.log({
			level: "error",
			message: "Error creating account",
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

export async function deleteAccount(req: Request, res: Response) {
	const { id } = req.params;
	const idNum = Number(id);

	if (!Number.isInteger(idNum) || idNum < 1) {
		res.status(400).json({ message: "Invalid account ID" });
		return;
	}

	try {
		await prisma.account.delete({
			where: { id: idNum }
		});

		res.status(200).json({
			message: "Account deleted successfully"
		});
	} catch (err) {
		if (err instanceof PrismaClientKnownRequestError && err.code === "P2025") {
			res.status(404).json({ message: "Account not found" });
			return;
		}

		logger.log({
			level: "error",
			message: "Error deleting account",
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

export async function editAccount(req: Request, res: Response) {
	const { id } = req.params;
	const idNum = Number(id);

	if (!Number.isInteger(idNum) || idNum < 1) {
		res.status(400).json({ message: "Invalid account ID" });
		return;
	}

	const accountData = AccountSchema.partial().safeParse(req.body);

	if (!accountData.success) {
		res.status(400).json({
			message: "Invalid account data",
			errors: treeifyError(accountData.error).errors
		});
		return;
	}

	try {
		const updatedAccount = await prisma.account.update({
			where: { id: idNum },
			data: accountData.data
		});

		res.status(200).json({
			message: "Account updated successfully",
			data: serializeData(updatedAccount)
		});
	} catch (err) {
		if (err instanceof PrismaClientKnownRequestError && err.code === "P2025") {
			res.status(404).json({ message: "Account not found" });
			return;
		}

		logger.log({
			level: "error",
			message: "Error updating account",
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
