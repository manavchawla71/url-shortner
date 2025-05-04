// deleteAll.js
import mongoose from "mongoose";

// Replace with your MongoDB Atlas connection string
const mongoURI =
  "mongodb+srv://chawlamanav428:k6ffELIOrbrO6CSq@cluster0.eykup4o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Replace with your collection's Mongoose model name and schema
const urlSchema = new mongoose.Schema({
  shortCode: String,
  originalUrl: String,
  Clicks: Number,
});
const Url = mongoose.model("Url", urlSchema); // change 'Url' if your model is named differently

async function deleteAllDocs() {
  console.log("🔁 Script started");

  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB Atlas");

    const countBefore = await Url.countDocuments();
    console.log(`📊 Documents before deletion: ${countBefore}`);

    const result = await Url.deleteMany({});
    console.log(`🗑️ Deleted ${result.deletedCount} documents`);

    const countAfter = await Url.countDocuments();
    console.log(`📊 Documents after deletion: ${countAfter}`);
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected");
  }
}
deleteAllDocs();
