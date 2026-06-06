import dotenv from "dotenv";
dotenv.config();

import "./config/db";
import app from "./app";

// ONLY LOCAL DEVELOPMENT
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`
====================================
🚀 CalTrack API running
📍 Environment: ${process.env.NODE_ENV || "development"}
🌐 Port: ${PORT}
====================================
    `);
  });
}