import cron from "node-cron";
import axios from "axios"

export const cronJob = () => {
  cron.schedule("*/10 * * * *", async() => {
    console.log("Running cron job every 14 minutes");
    await axios.get(`${process.env.FRONTEND_URL}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
  });
};
