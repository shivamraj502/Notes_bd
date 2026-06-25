/**
Day 114 – Mini Project: Full-Stack Notes App

Task:
Backend (Node + MongoDB)
Connect with frontend (React)
Deploy live
 */


const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

mongoose.connect("mongodb+srv://notes:shivamrajnotesapp@cluster0.7o5ewzc.mongodb.net/notesDB?appName=Cluster0")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const noteSchema = new mongoose.Schema({
  title: String
});

const Note = mongoose.model("Note", noteSchema);

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