import type { TransportStreamOptions } from "winston-transport";
import type { PrismaClient } from "./generated/prisma/client";

export enum LogLevel {
	DEBUG = 1,
	INFO,
	WARN,
	ERROR,
	FATAL
}

export interface DatabaseTransportOptions extends TransportStreamOptions {
	prisma: PrismaClient;
}
