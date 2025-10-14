// service1/server.js

const express = require("express");
const connectDB = require("./db");
const Quiz = require("./quizModel");
const app = express();

app.use(express.json());
connectDB();

// Add Question
app.post("/add-question", async (req, res) => {
  try {
    const { question, options, answer } = req.body;

    // --- IMPROVED VALIDATION ---
    if (!question || !options || !answer) {
      return res.status(400).json({ error: "All fields are required" });
    }
    // Check if options is an array and if any option is an empty string
    if (!Array.isArray(options) || options.some(opt => typeof opt !== 'string' || opt.trim() === '')) {
        return res.status(400).json({ error: "Options cannot be empty." });
    }
    if (!options.includes(answer)) {
        return res.status(400).json({ error: "The correct answer must match one of the options." });
    }
    // --- END VALIDATION ---

    const newQ = await Quiz.create({ question, options, answer });
    res.json({ message: "Question added", data: newQ });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Questions
app.get("/questions", async (req, res) => {
  try {
    const questions = await Quiz.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5001, () => console.log("Quiz Service running on port 5001"));