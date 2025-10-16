import express from "express";
import cors from "cors";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("✅ Backend server is running...");
});

// ✅ Simulation route
app.post("/api/simulate", (req, res) => {
  const { current, time } = req.body;

  // Simple dummy logic for testing
  const massDeposited = (current * time * 0.1).toFixed(2);

  res.json({
    message: `Simulation complete: ${massDeposited}g of metal deposited.`,
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
