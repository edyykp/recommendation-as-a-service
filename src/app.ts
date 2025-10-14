import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import config from "./config/config.js";
import { ApiClient } from "recombee-api-client";
import { resetCatalog, uploadMovies, addItemProperties } from "./recombee.js";

const app = express();
app.use(express.json());

// Initialize Recombee client
const recombeeClient = new ApiClient(
  "lab-sr-dev",
  config.recombeePrivateToken,
  {
    region: "eu-west",
  }
);

// Reset catalog, then upload movies
(async () => {
  await resetCatalog(recombeeClient);
  await addItemProperties(recombeeClient);
  await uploadMovies(recombeeClient);
})();

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
