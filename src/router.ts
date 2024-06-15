import { Router } from "express";
import statisticsRoutes from "./features/statistics/statistics.routes";

export const statisticsRouter = () => {
  const router = Router();
  statisticsRoutes(router);
  return router;
};
