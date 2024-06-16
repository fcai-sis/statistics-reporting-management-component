import { CourseModel, EnrollmentModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

/*
 * Get the success rate of a specific course (number of students who passed the course / total number of students in the course)
 * */

type HandlerRequest = Request<
  {
    courseId: string;
  },
  {},
  {}
>;
const handler = async (req: HandlerRequest, res: Response) => {
  const { courseId } = req.params;
  const course = await CourseModel.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }
  // get all enrollments for the course
  const courseEnrollments = await EnrollmentModel.find({ courseId });

  if (!courseEnrollments.length) {
    return res
      .status(404)
      .json({ message: "No enrollments found for the course" });
  }

  // get the number of students who passed the course
  const passedStudents = courseEnrollments.filter(
    (enrollment) => enrollment.status === "passed"
  );

  // get the total number of students in the course
  const totalNumberOfStudents = courseEnrollments.length;

  // get the success rate of the course
  const successRate = (passedStudents.length / totalNumberOfStudents) * 100;

  const response = {
    successRate,
  };

  return res.status(200).json(response);
};

const getSuccessRateOfCourseHandler = handler;

export default getSuccessRateOfCourseHandler;
