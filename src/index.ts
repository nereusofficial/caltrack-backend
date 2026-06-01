import dotenv from "dotenv";
import "./config/db";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`
====================================
🚀 CalTrack API running
📍 Environment: ${process.env.NODE_ENV || "development"}
🌐 Port: ${PORT}
====================================
      `);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();