const express = require("express");
const connectDB = require("./db");
const Result = require("./resultModel");
const axios = require("axios");

const app = express();
app.use(express.json());

connectDB();


app.post("/submit", async (req, res) => {
  try {
    const { username, answers } = req.body;

    if (!username || !answers) {
      return res.status(400).json({ error: "Username and answers required" });
    }

    const { data: questions } = await axios.get("http://localhost:5001/questions");

    let score = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) score++;
    });

    const newResult = await Result.create({
      username,
      score,
      total: questions.length
    });

    res.json({ message: "Result saved", result: newResult });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// View All Results
app.get("/results", async (req, res) => {
  try {
    const results = await Result.find();
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5002, () => console.log("Result Service running on port 5002"));
