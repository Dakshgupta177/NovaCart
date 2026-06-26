import cron from "node-cron";
import axios from "axios"

export const cronJob = () => {
  cron.schedule("*/10 * * * *", async() => {
    console.log("Running cron job every 14 minutes");
    await axios.get(`http://localhost:${process.env.PORT}/health`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
  });
};
