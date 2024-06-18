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
  const failedStudents = courseEnrollments.filter(
    (enrollment) => enrollment.status === "failed"
  );

  // get the total number of students in the course
  const totalNumberOfStudents = courseEnrollments.length;

  // get the success rate of the course
  const failureRate = (failedStudents.length / totalNumberOfStudents) * 100;

  const response = {
    failureRate,
  };

  return res.status(200).json(response);
};

const getFailureRateOfCourseHandler = handler;

export default getFailureRateOfCourseHandler;
