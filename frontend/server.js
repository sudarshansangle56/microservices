const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Home Page
app.get("/", (req, res) => {
  res.render("index");
});

// Quiz Page (fetches questions from quiz-service)
app.get("/quiz", async (req, res) => {
  try {
    const { data: questions } = await axios.get("http://localhost:5001/questions");
    res.render("quiz", { questions });
  } catch (error) {
    res.send("Error fetching quiz questions");
  }
});

// Result Page (posts answers to result-service)
app.post("/submit", async (req, res) => {
  try {
    const { username, ...answers } = req.body;

    // convert answers object to array
    const userAnswers = Object.values(answers);

    const response = await axios.post("http://localhost:5002/submit", {
      username,
      answers: userAnswers,
    });

    res.render("result", { result: response.data.result });
  } catch (error) {
    res.send("Error submitting quiz");
  }
});
// --- ADD QUESTION PAGE ---
app.get("/add-question", (req, res) => {
    res.render("add-question");
  });
  
  // --- HANDLE QUESTION SUBMIT ---
  app.post("/add-question", async (req, res) => {
    try {
      const { question, option1, option2, option3, answer } = req.body;
  
      await axios.post("http://localhost:5001/add-question", {
        question,
        options: [option1, option2, option3],
        answer,
      });
  
      res.send("<h2>Question Added Successfully!</h2><a href='/'>Back to Home</a>");
    } catch (error) {
      res.send("Error adding question: " + error.message);
    }
  });
  

app.listen(5000, () => console.log("Frontend running on port 5000"));
