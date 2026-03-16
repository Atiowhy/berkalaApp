import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// route
import authRoute from "./src/routes/authRoute.js";
import habitRoute from "./src/routes/habitRoute.js";
import todoRoute from "./src/routes/todoRoute.js";
import transactionRoute from "./src/routes/transactionRoute.js";
import savingRoutes from "./src/routes/savingRoute.js";
import profileRoutes from "./src/routes/profileRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

// routing
app.use("/auth", authRoute);
app.use("/habit", habitRoute);
app.use("/todos", todoRoute);
app.use("/transactions", transactionRoute);
app.use("/savings", savingRoutes);
app.use("/profile", profileRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on localhost://localhost:${PORT}`);
});

export default app;
