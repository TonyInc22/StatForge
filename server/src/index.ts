import "dotenv/config";
import express from "express";
import cors from "cors";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const allowedOrigins = [
  "http://localhost:5174",
  "http://127.0.0.1:5174"
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200
  })
);
app.use(express.json());

// GET teams
app.get("/api/teams", cors(), async (_req, res) => {
  const teams = await prisma.team.findMany({ orderBy: { name: "asc" } });
  res.json(teams);
});

// POST team
app.post("/api/teams", cors(), async (req, res) => {
  const bodySchema = z.object({
	name: z.string().min(2),
	code: z.string().min(2).max(5),
	league: z.string().min(2),
  });
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const team = await prisma.team.create({ data: parsed.data });
  res.status(201).json(team);
});

const port = process.env.PORT ?? 4000;
app.listen(port, () => console.log(`API on http://localhost:${port}`));
