// server.js
import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
app.use(express.json());

// Enable static file serving for testing locally
app.use(express.static("."));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message || "";

  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "You are the Cosmic Assistant on Mayank Goyal's portfolio. " +
            "Answer clearly, briefly, and professionally. You can talk about his skills, projects, and how to contact him."
        },
        { role: "user", content: userMessage }
      ]
    });
 
    const aiText =
      response.output[0].content[0].text || "I could not generate a reply.";
 
    res.json({ reply: aiText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Backend assistant error" });
  }
});

// Simple in-memory rate limiter to prevent API spamming
const ipRequests = new Map();

// Endpoint to log unanswered questions to logs/unanswered.json (secured)
app.post("/api/unanswered", (req, res) => {
  const { question } = req.body;
  
  // 1. Input validation & sanitization
  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "A valid question string is required" });
  }

  const trimmedQuestion = question.trim();

  // 2. Length capping to prevent buffer overflow/DOS spam
  if (trimmedQuestion.length < 2 || trimmedQuestion.length > 150) {
    return res.status(400).json({ error: "Question must be between 2 and 150 characters." });
  }

  // 3. IP-based Rate Limiting (5 requests per minute per IP)
  const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const now = Date.now();
  const clientRequests = ipRequests.get(ip) || [];

  // Remove request timestamps older than 1 minute (60000ms)
  const recentRequests = clientRequests.filter(timestamp => now - timestamp < 60000);

  if (recentRequests.length >= 5) {
    console.warn(`Rate limit triggered for IP ${ip} on /api/unanswered`);
    return res.status(429).json({ error: "Too many requests. Please try again later." });
  }

  recentRequests.push(now);
  ipRequests.set(ip, recentRequests);

  const logDir = path.join(process.cwd(), "logs");
  const logFile = path.join(logDir, "unanswered.json");

  try {
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    let logs = [];
    if (fs.existsSync(logFile)) {
      const data = fs.readFileSync(logFile, "utf8");
      logs = JSON.parse(data);
    }

    // 4. Limit the log file size (max 500 unique entries) to prevent disk space exhaustion
    if (logs.length >= 500) {
      console.warn("Unanswered questions log has reached maximum limit of 500. Ignoring new entries.");
      return res.status(400).json({ error: "Logs limit reached. Cannot record new question." });
    }

    if (!logs.includes(trimmedQuestion)) {
      logs.push(trimmedQuestion);
      fs.writeFileSync(logFile, JSON.stringify(logs, null, 2), "utf8");
      console.log(`Saved unanswered question to logs/unanswered.json: "${trimmedQuestion}"`);
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error writing to unanswered.json:", err);
    res.status(500).json({ error: "Failed to write logs" });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

