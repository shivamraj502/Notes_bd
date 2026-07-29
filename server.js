/**
Day 114 – Mini Project: Full-Stack Notes App

Task:
Backend (Node + MongoDB)
Connect with frontend (React)
Deploy live
 */

// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");

// const app = express();

// app.use(cors());
// app.use(express.json());

// mongoose.connect(process.env.MONGO_URI)
// .then(() => console.log("MongoDB Connected"))
// .catch(err => console.log(err));

// const noteSchema = new mongoose.Schema({
//   title: String
// });

// const Note = mongoose.model("Note", noteSchema);

// app.get("/", (req, res) => {
//   res.send("Backend Running");
// });

// app.post("/notes", async (req, res) => {
//   const note = new Note(req.body);
//   await note.save();

//   res.json({
//     message: "Note Added"
//   });
// });

// app.get("/notes", async (req, res) => {
//   const notes = await Note.find();
//   res.json(notes);
// });

// app.delete("/notes/:id", async (req, res) => {
//   await Note.findByIdAndDelete(req.params.id);

//   res.json({
//     message: "Note Deleted"
//   });
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const authMiddleware = require("./middleware/auth");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const noteSchema = new mongoose.Schema({
  title: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

const Note = mongoose.model("Note", noteSchema);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

// ---------- AUTH ROUTES ----------

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---------- NOTES ROUTES (protected) ----------

app.post("/notes", authMiddleware, async (req, res) => {
  const note = new Note({ title: req.body.title, user: req.userId });
  await note.save();

  res.json({
    message: "Note Added"
  });
});

app.get("/notes", authMiddleware, async (req, res) => {
  const notes = await Note.find({ user: req.userId });
  res.json(notes);
});

app.delete("/notes/:id", authMiddleware, async (req, res) => {
  await Note.findOneAndDelete({ _id: req.params.id, user: req.userId });

  res.json({
    message: "Note Deleted"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});