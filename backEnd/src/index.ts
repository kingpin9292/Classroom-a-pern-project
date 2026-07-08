import express from "express";
import subjectRouter from "./routes/subjects.js";
const app = express();
const port = 8000;

app.use(express.json());
app.use("/api/subjects", subjectRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
