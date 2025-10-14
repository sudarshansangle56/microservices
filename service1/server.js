const express = require("express");
const connectDB = require("./db");
const Quiz = require("./quizModel");

const app = express();
app.use(express.json());

connectDB();

// Route 1: Add Question
app.post("/add-question", async (req, res) => {
  try {
    const newQ = await Quiz.create(req.body);
    res.json({ message: "Question added", data: newQ });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route 2: Get All Questions
app.get("/questions", async (req, res) => {
  const questions = await Quiz.find();
  res.json(questions);
});

app.listen(5001, () => console.log("Quiz Service running on port 5001"));
