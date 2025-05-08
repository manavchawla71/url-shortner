import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import dotenv from "dotenv";
import Url from "./models/Url.js"; // import your model

const app = express();
dotenv.config();
// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const baseurl = "https://url-shortner-1-vxhw.onrender.com/"; // Replace with your deployed domain when ready

app.get("/", (req, res) => {
  res.status(200).json({ message: "message recieved from client" });
});
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
  console.log("=== Link Hit ===");
  console.log("Time:", new Date().toISOString());
  console.log("User-Agent:", req.headers["user-agent"]);
  console.log("IP:", req.ip);
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server listening on http://localhost:3000");
});
