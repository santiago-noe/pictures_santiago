import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { env } from "./lib/env";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth";
import categoryRoutes from "./routes/categories";
import photoRoutes from "./routes/photos";

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/photos", photoRoutes);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Backend escuchando en el puerto ${env.port}`);
});
