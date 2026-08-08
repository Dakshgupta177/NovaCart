import cron from "node-cron";
import axios from "axios"
import { configDotenv } from "dotenv";
configDotenv();

export const cronJob = () => {
  cron.schedule("*/10 * * * *", async() => {
    console.log("Running cron job every 14 minutes");
    await axios.get(`${process.env.BACKEND_URL}/health`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
  });
};
