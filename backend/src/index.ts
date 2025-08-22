import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import { apiRouter } from "./routes/api.ts";

dotenv.config({ path: "../.env" });

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const MONGO_URI = process.env.MONGO_URI || "";

async function start() {
    if (!MONGO_URI) throw new Error("Missing MONGO_URI");
    await mongoose.connect(MONGO_URI);
    app.use("/", apiRouter);
    app.listen(PORT, () => console.log(`API listening on ${PORT}`));
}

start().catch((e) => {
    console.error(e);
    process.exit(1);
});
