import express, { Router } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import serverless from "serverless-http";
import OpenAI from "openai";

dotenv.config();

const app = express();
const router = Router();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

router.get("/", (req, res) =>
  res.status(200).json({ message: "Hello from DALL.E" })
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.get("/v1/dalle", (req, res) => {
  res.status(200).json({ message: "Hello from DALL.E routes" });
});

router.post("/v1/dalle", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await openai.images.generate({
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const image = response.data[0].b64_json;

    res.status(200).json({ photo: image });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.use("/api/", router);

export const handler = serverless(app);
