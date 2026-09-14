import express from "express";
import multer from "multer";
import { scanUrl } from "../services/accessibilityScanner.js";
import { analyzeDesignImage } from "../services/designToCode.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/scan/url  { url: "https://example.com" }
router.post("/url", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "url is required" });

  try {
    const report = await scanUrl(url);
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Scan failed", details: err.message });
  }
});

// POST /api/scan/design  (multipart form, field name: "image")
router.post("/design", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "image file is required" });

  try {
    const result = await analyzeDesignImage(req.file.buffer);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analysis failed", details: err.message });
  }
});

export default router;
