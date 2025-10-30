import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = "./data";

app.use(cors());
app.use(express.json());

// Helper to ensure data directory exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

// --- READ widget data ---
app.get("/data/:id", (req, res) => {
  const widgetId = req.params.id;
  const filePath = path.join(DATA_DIR, `${widgetId}.json`);

  try {
    if (!fs.existsSync(filePath)) {
      // Create default file if missing
      const defaultData = { counter: 0, lastUpdated: "never" };
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }
    const json = fs.readFileSync(filePath, "utf-8");
    res.json(JSON.parse(json));
  } catch (err) {
    console.error("Error reading file:", err);
    res.status(500).json({ error: "Could not read data" });
  }
});

// --- UPDATE widget data ---
app.post("/update/:id", (req, res) => {
  const widgetId = req.params.id;
  const filePath = path.join(DATA_DIR, `${widgetId}.json`);

  try {
    fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error("Error writing file:", err);
    res.status(500).json({ error: "Could not update data" });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
