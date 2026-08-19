import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import cors from "cors"

import adminRoutes from "./routes/admin.routes"
import authRoutes from "./routes/auth.routes"

const app = express();
app.use(express.json());

app.use(
    cors({
        // origin: "http://localhost:5173", // frontend URL
        // credentials: true, to be enabled later for security
    })
);

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server running on ${port}`);
});

app.get("/", (req: Request, res: Response) => {
    res.send("API is running...");
});

app.use("/admin", adminRoutes)
app.use("/auth", authRoutes)
