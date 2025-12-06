import winston from "winston";
import Transport from "winston-transport";
import prisma from "./database";
import type { PrismaClient } from "../generated/prisma/client";
import { LogLevel, type DatabaseTransportOptions } from "../types";

class DatabaseTransport extends Transport {
	private prisma: PrismaClient;

	constructor(options: DatabaseTransportOptions) {
		super(options);
		this.prisma = options.prisma;
	}

	async log(info: winston.Logform.TransformableInfo, callback: () => void) {
		setImmediate(() => {
			this.emit("logged", info);
		});

		try {
			await this.prisma.log.create({
				data: {
					levelId: LogLevel[info.level.toUpperCase() as keyof typeof LogLevel],
					message: info.message as string,
					details: (info.details as object) ?? null,
					timestamp: info.timestamp
						? new Date(info.timestamp as string)
						: new Date()
				}
			});
		} catch (err) {
			this.emit("error", err);
		} finally {
			callback();
		}
	}
}

const levels = {
	fatal: 0,
	error: 1,
	warn: 2,
	info: 3,
	debug: 4
};

winston.addColors({
	fatal: "redBG white",
	error: "red",
	warn: "yellow",
	info: "green",
	debug: "blue"
});

export default winston.createLogger({
	levels: levels,
	level: "info",
	transports: [
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.timestamp({ format: "YYYY/MM/DD-HH:mm:ss" }),
				winston.format.printf(({ timestamp, level, message, details }) =>
					// Add padding to level for alignment
					`${timestamp} - ${level.padEnd(7)}${message} ${details ? JSON.stringify(details) : ""}`.trim()
				)
			)
		}),
		new DatabaseTransport({
			format: winston.format.combine(winston.format.timestamp()),
			prisma
		})
	]
});
