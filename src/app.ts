import express from "express";
import path from "node:path";
import { apiRouter } from "./interfaces/http/routes";
import { errorHandler } from "./interfaces/http/middlewares/error-handler";
import { notFoundHandler } from "./interfaces/http/middlewares/not-found-handler";

export const app = express();
const publicDirectory = path.resolve(__dirname, "../public");

app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.static(publicDirectory));

app.get("/health", (_request, response) => {
  response.status(200).json({
    status: "ok",
    service: "ascension-engine-api",
  });
});

app.get("/", (_request, response) => {
  response.sendFile(path.join(publicDirectory, "index.html"));
});

app.use("/api/v1", apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);
