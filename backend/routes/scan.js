import express from "express";
import multer from "multer";
import { scanUrl } from "../services/accessibilityScanner.js";
import { analyzeDesignImage } from "../services/designToCode.js";
import fs from "fs";
import os from "os";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/scan/url  { url: "https://example.com" }

router.get("/debug-chrome", (req, res) => {
  const cacheDir = process.env.PUPPETEER_CACHE_DIR || `${os.homedir()}/.cache/puppeteer`;
  try {
    const contents = fs.readdirSync(cacheDir, { recursive: true });
    res.json({ cacheDir, exists: true, contents });
  } catch (err) {
    res.json({ cacheDir, exists: false, error: err.message });
  }
});

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
