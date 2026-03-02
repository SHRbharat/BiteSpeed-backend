const express = require("express");
const dotenv = require("dotenv");
const identifyRoutes = require("./routes/identifyRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/identify", identifyRoutes);

// Endpoint to verify that the server is alive and responding.
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
