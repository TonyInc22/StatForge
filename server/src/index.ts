import "dotenv/config";
import express from "express";
import cors from "cors";
import { int, z } from "zod";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const allowedOrigins = [
  "http://localhost:5174",
  "http://127.0.0.1:5174"
];

// 1) Simple, dev-friendly CORS (no throwing, echoes origin)
app.use(
  cors({
    origin: true, // reflect request origin (e.g., http://localhost:5173)
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,           // keep false unless you're using cookies
    optionsSuccessStatus: 200,    // so some older browsers don't choke
  })
);

// 2) Lightweight preflight handler (replace ANY app.options() usage)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    // You can add max-age if you want the browser to cache preflights
    res.setHeader("Access-Control-Max-Age", "86400"); // 24h
    return res.sendStatus(204);
  }
  next();
});

// 3) then your JSON/body parser and routes
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

// GET teams
app.get("/api/teams", cors(), async (_req, res) => {
  const teams = await prisma.team.findMany({ orderBy: { name: "asc" } });
  res.json(teams);
});

// GET specific team
app.get("/api/teams/:id", cors(), async (_req, res) => {
  let TeamId = Number(_req.params.id);

  if (isNaN(TeamId))
    return res.status(400).json({error: "Invalid Team ID"})

  const Team = await prisma.team.findFirst({where: {id: TeamId}});
  
  if (!Team)
    return res.status(400).json({error: "Team not found"})
  
  res.json(Team)
})

// POST team
app.post("/api/teams", cors(), async (req, res) => {
  // const bodySchema = z.object({
	// name: z.string().min(2),
	// code: z.string().min(2).max(5),
	// league: z.string().min(2),
  // });
  // const parsed = bodySchema.safeParse(req.body);
  // if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  // const team = await prisma.team.create({ data: parsed.data });
  // res.status(201).json(team);
});

const port = process.env.PORT ?? 4000;
app.listen(port, () => console.log(`API on http://localhost:${port}`));
