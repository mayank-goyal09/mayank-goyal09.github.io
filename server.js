// server.js
import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
