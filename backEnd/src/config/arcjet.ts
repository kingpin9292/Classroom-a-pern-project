import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";
import dotenv from "dotenv";
dotenv.config();
const key = process.env.ARCJET_KEY?.trim();

if (!key && process.env.NODE_ENV !== "test") {
  throw new Error("ARCJET_KEY env is required");
}

const aj = arcjet({
  key: key!,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW"],
    }),
    slidingWindow({
      mode: "LIVE",
      interval: "2s",
      max: 5,
    }),
  ],
});
export default aj;
