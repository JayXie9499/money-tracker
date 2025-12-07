import dotenv from "dotenv";
import { ConfigSchema } from "../schemas";

dotenv.config();

export default ConfigSchema.parse(process.env);
