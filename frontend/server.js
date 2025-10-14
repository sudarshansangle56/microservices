// server.js (in the root MICROSERVICE folder)

const express = require("express");
const axios = require("axios");
const path = require("path");
const app = express();

// Set up view engine and middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "frontend/views"));
app.use(express.static(path.join(__dirname, "frontend/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const QUIZ_SERVICE_URL = "http://localhost:5001";
const RESULT_SERVICE_URL = "http://localhost:5002";

// --- Page Rendering Routes ---

// Render Home Page
app.get("/", (req, res) => {
  res.render("index");
});

// Render Add Question Page
app.get("/add-question", (req, res) => {
  res.render("add-question");
});

// Render Quiz Page
app.get("/quiz", async (req, res) => {
  try {
    const response = await axios.get(`${QUIZ_SERVICE_URL}/questions`);
    res.render("quiz", { questions: response.data });
  } catch (error) {
    res.status(500).send("Error fetching questions");
  }
});

// Render All Results Page
app.get("/results", async (req, res) => {
    try {
        const response = await axios.get(`${RESULT_SERVICE_URL}/results`);
        // Pass both allResults and a null result for the single score display
        res.render("result", { allResults: response.data, result: null });
    } catch (error) {
        res.status(500).send("Error fetching results");
    }
});


// --- API Handling Routes ---

// Handle Add Question Form Submission
app.post("/add-question", async (req, res) => {
  try {
    // ---- ADD THIS LINE FOR DEBUGGING ----
    console.log("Form Data Received:", req.body);

    const { question, options, answer } = req.body;
    await axios.post(`${QUIZ_SERVICE_URL}/add-question`, {
      question,
      options,
      answer,
    });
    res.redirect("/add-question");
  } catch (error) {
    // ...
  }
});

// Handle Quiz Submission
app.post("/submit", async (req, res) => {
  try {
    const { username, answers } = req.body;
    
    // 1. Submit the current quiz answers to the result service
    const response = await axios.post(`${RESULT_SERVICE_URL}/submit`, {
      username,
      answers,
    });

    // 2. IMPORTANT: Fetch the complete list of all results
    const allResultsResponse = await axios.get(`${RESULT_SERVICE_URL}/results`);
    
    // 3. Render the result page, passing BOTH the new result AND the full list
    res.render("result", { 
        result: response.data.result, 
        allResults: allResultsResponse.data 
    });

  } catch (error) {
    // Log the detailed error for debugging
    console.error("Error in /submit route:", error.message);
    res.status(500).send("Error submitting quiz");
  }
});


const PORT = 5000;
app.listen(PORT, () => console.log(`Frontend & Gateway Server running on port ${PORT}`));