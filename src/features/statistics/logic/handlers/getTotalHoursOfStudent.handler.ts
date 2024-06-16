import { EnrollmentModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

/*
 * Get the total number of hours a student has studied
 * */

type HandlerRequest = Request<
  {
    studentId: string;
  },
  {},
  {}
>;
const handler = async (req: HandlerRequest, res: Response) => {
  const { studentId } = req.params;

  // find all passed enrollments for the student
  const passedEnrollments = await EnrollmentModel.find({
    studentId,
    status: "passed",
  }).populate("courseId");

  // get the total number of hours the student has studied
  const totalNumberOfHours = passedEnrollments.reduce(
    (totalHours, enrollment) => totalHours + enrollment.courseId.creditHours,
    0
  );

  const response = {
    totalNumberOfHours,
  };

  return res.status(200).json(response);
};

const getTotalHoursOfStudentHandler = handler;

export default getTotalHoursOfStudentHandler;
