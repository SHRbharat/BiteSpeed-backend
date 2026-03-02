import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { identify } from "./controllers/identifyController.js";
import { resetDatabase } from "./controllers/resetController.js";
import validateIdentify from "./middleware/validateIdentify.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security Headers
app.use(helmet());

// Rate Limiting : Limit each IP to 100 requests per windowMs
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

app.use(limiter);

app.use(express.json());

// Routes
app.post("/identify", validateIdentify, identify);
app.delete("/delete", resetDatabase);

// Endpoint to verify that the server is alive and responding.
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
