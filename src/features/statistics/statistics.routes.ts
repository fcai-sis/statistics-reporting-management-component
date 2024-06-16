import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";
import getAllStudentsHandler from "./logic/handlers/getAllStudents.handler";
import { paginationQueryParamsMiddleware } from "@fcai-sis/shared-middlewares";
import getNationalityDistHandler from "./logic/handlers/getNationalityDistribution.handler";
import getSuccessRateOfCourseHandler from "./logic/handlers/getSuccessRateOfCourse.handler";
import getTotalHoursOfStudentHandler from "./logic/handlers/getTotalHoursOfStudent.handler";

const statisticsRoutes = (router: Router) => {
  router.get(
    "/get-all-students",
    paginationQueryParamsMiddleware,
    asyncHandler(getAllStudentsHandler)
  );

  router.get("/get-nationality-dist", asyncHandler(getNationalityDistHandler));

  router.get(
    "/get-success-rate-of-course/:courseId",
    asyncHandler(getSuccessRateOfCourseHandler)
  );

  router.get(
    "/get-total-hours-of-student/:studentId",
    asyncHandler(getTotalHoursOfStudentHandler)
  );
};

export default statisticsRoutes;
