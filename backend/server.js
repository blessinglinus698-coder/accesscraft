import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import scanRoutes from "./routes/scan.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "AccessCraft API" });
});

app.use("/api/scan", scanRoutes);

app.listen(PORT, () => {
  console.log(`AccessCraft backend running on http://localhost:${PORT}`);
});
