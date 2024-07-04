import {
  CourseModel,
  EnrollmentModel,
  EnrollmentStatusEnum,
} from "@fcai-sis/shared-models";
import { Request, Response } from "express";

/*
 * Get the failure rate of a specific course (number of students who failed the course / total number of students in the course)
 * */

type HandlerRequest = Request<
  {
    courseCode: string;
  },
  {},
  {}
>;
const handler = async (req: HandlerRequest, res: Response) => {
  const { courseCode } = req.params;
  console.log(courseCode);

  const course = await CourseModel.findOne({
    code: courseCode,
  });
  if (!course) {
    return res.status(404).json({
      errors: [
        {
          message: "Course not found",
        },
      ],
    });
  }
  // get all enrollments for the course
  const courseEnrollments = await EnrollmentModel.find({
    course: course._id,
  });

  if (!courseEnrollments.length) {
    return res.status(404).json({
      errors: [
        {
          message: "No enrollments found for the course",
        },
      ],
    });
  }

  // get the number of students who failed the course
  const failedStudents = courseEnrollments.filter(
    (enrollment) => enrollment.status === EnrollmentStatusEnum[2]
  );

  // get the total number of students in the course
  const totalNumberOfStudents = courseEnrollments.length;

  // get the success rate of the course
  const successRate = (failedStudents.length / totalNumberOfStudents) * 100;

  const response = {
    successRate,
  };

  return res.status(200).json(response);
};

const getFailureRateOfCourseHandler = handler;

export default getFailureRateOfCourseHandler;
