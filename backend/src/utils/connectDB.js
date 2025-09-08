import { initDB } from "./initDB.js";

export const connectDB = async () => {
  try {
    await initDB();
  } catch (error) {
    console.log("Failed to start server", error.message);
  }
};
