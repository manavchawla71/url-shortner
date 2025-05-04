import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import Url from "./models/Url.js"; // import your model

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://chawlamanav428:k6ffELIOrbrO6CSq@cluster0.eykup4o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const baseurl = "http://localhost:3000/"; // Replace with your deployed domain when ready

// Shorten URL
app.get("/clicks/:shortcode", async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortcode });

    if (!url) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    res.status(200).json({ Clicks: url.Clicks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/shorten", async (req, res) => {
  const { enteredurl, code } = req.body;

  if (!enteredurl) {
    return res.status(400).json({ error: "URL is required" });
  }

  let shortcode;
  if (code) {
    shortcode = code;
  } else {
    shortcode = nanoid(6);
  }

  const newUrl = new Url({
    originalUrl: enteredurl,
    shortCode: shortcode,
    createdAt: new Date(),
  });

  await newUrl.save();

  const generatedurl = baseurl + shortcode;
  res.status(200).json({ shortUrl: generatedurl });
});

// Redirect using shortcode
app.get("/:shortcode", async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortcode });

    if (!url) {
      return res.status(404).send("Link not found");
    }

    url.Clicks += 1;
    await url.save();
    if (url.Clicks > 5) {
      //   await url.save();
      return res.status(410).json({ message: "Link expired" }); // 410 Gone is semantically better
    }

    res.redirect(url.originalUrl);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
