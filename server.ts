import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";
import cron from "node-cron";
import fs from "fs/promises";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(process.cwd(), "schedules.json");

async function loadSchedules() {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveSchedules(schedules: any[]) {
  await fs.writeFile(DB_PATH, JSON.stringify(schedules, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Proxy for Binance Square Posting
  app.post("/api/binance/post", async (req, res) => {
    const { content, apiKey, apiSecret } = req.body;

    if (!apiKey || !apiSecret) {
      return res.status(400).json({ error: "Binance API Key and Secret are required" });
    }

    try {
      console.log("Posting to Binance Square:", content);
      res.json({ success: true, postId: "mock_" + Date.now() });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Schedule management
  app.get("/api/schedules", async (req, res) => {
    const schedules = await loadSchedules();
    res.json(schedules);
  });

  app.post("/api/schedules", async (req, res) => {
    const schedules = await loadSchedules();
    const newSchedule = { id: Date.now().toString(), ...req.body };
    schedules.push(newSchedule);
    await saveSchedules(schedules);
    res.json(newSchedule);
  });

  app.delete("/api/schedules/:id", async (req, res) => {
    let schedules = await loadSchedules();
    schedules = schedules.filter((s: any) => s.id !== req.params.id);
    await saveSchedules(schedules);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Cron job to check for scheduled posts
  cron.schedule("* * * * *", async () => {
    const now = new Date();
    const schedules = await loadSchedules();
    let updated = false;

    for (const schedule of schedules) {
      const scheduleTime = new Date(schedule.time);
      if (scheduleTime <= now && !schedule.posted) {
        console.log(`Executing scheduled post: ${schedule.id}`);
        // In a real app, you'd call the Binance API here
        schedule.posted = true;
        updated = true;
      }
    }

    if (updated) {
      await saveSchedules(schedules);
    }
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
