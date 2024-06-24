import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";
import getAllStudentsHandler from "./logic/handlers/getAllStudents.handler";
import getNationalityDistHandler from "./logic/handlers/getNationalityDistribution.handler";
import getSuccessRateOfCourseHandler from "./logic/handlers/getSuccessRateOfCourse.handler";
import getTotalHoursOfStudentHandler from "./logic/handlers/getTotalHoursOfStudent.handler";
import getFailureRateOfCourseHandler from "./logic/handlers/getFailureRateOfCourse.handler";
import calculateStudentGpaHandler from "./logic/handlers/calculateStudentGpa.handler";
import getTop50StudentsHandler from "./logic/handlers/getTop50Students.handler";

const statisticsRoutes = (router: Router) => {
  router.get("/get-all-students", asyncHandler(getAllStudentsHandler));

  router.get("/get-nationality-dist", asyncHandler(getNationalityDistHandler));

  router.get(
    "/get-success-rate-of-course/:courseId",
    asyncHandler(getSuccessRateOfCourseHandler)
  );

  router.get(
    "/get-failure-rate-of-course/:courseId",
    asyncHandler(getFailureRateOfCourseHandler)
  );

  router.get(
    "/get-total-hours-of-student/:studentId",
    asyncHandler(getTotalHoursOfStudentHandler)
  );

  router.get(
    "/get-student-gpa/:studentId",
    asyncHandler(calculateStudentGpaHandler)
  );

  //TODO: TEST THIS WHEN STUDENTSEMESTER IS READY
  router.get(
    "/get-top-50-students",
    asyncHandler(getTop50StudentsHandler as any)
  );
};

export default statisticsRoutes;
