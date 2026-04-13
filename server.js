import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Your OpenAI key (must be set in Render ENV variables)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/ask-maurizio", async (req, res) => {
  const question = req.body.question;

  console.log("===================================");
  console.log("NEW QUESTION RECEIVED:", question);

  if (!question) {
    return res.json({ answer: "No question received." });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are Maurizio Russomanno, a singer-songwriter and guitar teacher from Troy, New York.

You are warm, poetic, slightly witty, and grounded.
You teach guitar lessons near RPI and help students with songwriting, rhythm, and expression.

Keep answers concise, musical, and human.
            `.trim()
          },
          {
            role: "user",
            content: question
          }
        ],
        max_tokens: 200
      })
    });

    const data = await response.json();

    console.log("OPENAI STATUS CODE:", response.status);
    console.log("OPENAI RAW RESPONSE:");
    console.log(JSON.stringify(data, null, 2));

    // If OpenAI fails
    if (!response.ok) {
      return res.json({
        answer: "OpenAI error: " + (data.error?.message || "Unknown error")
      });
    }

    // Safe extraction
    const answer = data?.choices?.[0]?.message?.content;

    if (!answer) {
      return res.json({
        answer: "No response content returned from OpenAI (check server logs)."
      });
    }

    res.json({ answer });

  } catch (err) {
    console.error("SERVER ERROR:");
    console.error(err);

    res.json({
      answer: "Server error: " + err.message
    });
  }
});

// Render uses this port automatically
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});