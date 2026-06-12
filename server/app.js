// import { run_research_pipeline } from "./src/pipeline.js";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
const app = express();
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});
const corsOptions = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Length", "X-RateLimit-Remaining"],
  optionsSuccessStatus: 200,
};
// middlewares
app.use(cors(corsOptions));

app.use(
  express.json({
    limit: "10mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  }),
);
app.use(limiter);
import AiRouter from "./src/routes/airesponse.route.js";
app.use("/api/research", AiRouter);
export { app };
// const state = await run_research_pipeline(userInput);
// console.log("\nPipeline finished. Result state:", state);
