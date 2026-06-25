/**
Day 114 – Mini Project: Full-Stack Notes App

Task:
Backend (Node + MongoDB)
Connect with frontend (React)
Deploy live
 */

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const noteSchema = new mongoose.Schema({
  title: String
});

const Note = mongoose.model("Note", noteSchema);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.post("/notes", async (req, res) => {
  const note = new Note(req.body);
  await note.save();

  res.json({
    message: "Note Added"
  });
});

app.get("/notes", async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

app.delete("/notes/:id", async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);

  res.json({
    message: "Note Deleted"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});