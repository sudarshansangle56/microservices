const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/quizDB");
    console.log("Quiz DB Connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};

module.exports = connectDB;
