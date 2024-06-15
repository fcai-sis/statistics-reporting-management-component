import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";
import getAllStudentsHandler from "./logic/handlers/getAllStudents.handler";
import { paginationQueryParamsMiddleware } from "@fcai-sis/shared-middlewares";
import getNationalityDistHandler from "./logic/handlers/getNationalityDistribution.handler";

const statisticsRoutes = (router: Router) => {
  router.get(
    "/get-all-students",
    paginationQueryParamsMiddleware,
    asyncHandler(getAllStudentsHandler)
  );

  router.get(
    "/get-nationality-dist",
    asyncHandler(getNationalityDistHandler)
  )
};

export default statisticsRoutes;
