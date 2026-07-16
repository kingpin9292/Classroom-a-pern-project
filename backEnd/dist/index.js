import express from "express";
import subjectsRouter from "./routes/subjects.js";
import cors from "cors";
import securityMiddleware from "./middleware/security.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
const app = express();
const port = 8000;
if (!process.env.FRONTEND_URL) {
    throw new Error("FRONTEND_URL is not set in .env file");
}
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());
app.use(securityMiddleware); // Apply the security middleware to all routes
app.use("/api/subjects", subjectsRouter);
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map