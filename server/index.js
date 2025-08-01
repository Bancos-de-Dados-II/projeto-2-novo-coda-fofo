import { config } from "dotenv";
import { iniciarMongoose } from "./config/mongoose.js";

config();

iniciarMongoose(process.env.CONNECT_DB);
