import type { TransportStreamOptions } from "winston-transport";
import type { PrismaClient } from "./generated/prisma/client";

export interface DatabaseTransportOptions extends TransportStreamOptions {
	prisma: PrismaClient;
}
