import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";
import getNationalityDistHandler from "./logic/handlers/getNationalityDistribution.handler";
import getSuccessRateOfCourseHandler from "./logic/handlers/getSuccessRateOfCourse.handler";
import getFailureRateOfCourseHandler from "./logic/handlers/getFailureRateOfCourse.handler";
import getTopStudentsHandler from "./logic/handlers/getTop50Students.handler";
import getAverageGpaOfStudentInSemesterHandler from "./logic/handlers/getAverageGpaOfAllStudentsInSemester.handler";
import getStudentCountInSemesterHandler from "./logic/handlers/getStudentCountInSemester.handler";
import getBestPerformingStudentInSemesterHandler from "./logic/handlers/getBestPerformantOfStudentInSpecificSemester.handler";

const statisticsRoutes = (router: Router) => {
  router.get("/get-nationality-dist", asyncHandler(getNationalityDistHandler));

  router.get(
    "/get-success-rate-of-course/:courseCode",
    asyncHandler(getSuccessRateOfCourseHandler)
  );

  router.get(
    "/get-failure-rate-of-course/:courseCode",
    asyncHandler(getFailureRateOfCourseHandler)
  );
  router.get(
    "/get-avg-gpa/:semesterId",
    asyncHandler(getAverageGpaOfStudentInSemesterHandler)
  );
  router.get(
    "/get-count/:semesterId",
    asyncHandler(getStudentCountInSemesterHandler)
  );
  router.get(
    "/get-best-gpa/:semesterId",
    asyncHandler(getBestPerformingStudentInSemesterHandler)
  );

  router.get("/students/top", asyncHandler(getTopStudentsHandler as any));
};

export default statisticsRoutes;
