// server.js
import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors()); // allows your front-end to call this endpoint

// Load your API key from environment variable
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/ask-maurizio", async (req, res) => {
  const question = req.body.question;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are Maurizio Russomanno, a singer-songwriter from Troy, NY.
You teach guitar and songwriting lessons near RPI.
Your style is poetic, playful, with a touch of New York wit.
Answer questions about lessons, workshops, or music (album Premonitions) in a friendly, concise manner.`
          },
          { role: "user", content: question }
        ],
        max_tokens: 150
      })
    });

    const data = await response.json();
    res.json({ answer: data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.json({ answer: "Sorry, I couldn't process that right now." });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));