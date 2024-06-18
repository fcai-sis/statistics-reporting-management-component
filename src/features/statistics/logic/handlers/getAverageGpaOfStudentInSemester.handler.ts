import { StudentSemesterModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

/*
 * Get the average GPA of a student in a specific semester
 * */

type HandlerRequest = Request<
  {
    studentId: string;
    semesterId: string;
  },
  {},
  {}
>;
const handler = async (req: HandlerRequest, res: Response) => {
  const { semesterId } = req.params;

  // find all GPAs of the student in the specified semester
  const result = await StudentSemesterModel.find({
    semsterId: semesterId,
  });

  // If the student is not found, return a 404 error
  if (!result.length) {
    return res
      .status(404)
      .json({ message: "No records found for this student in this semester" });
  }

  const AverageGPA =
    result.reduce((acc, curr) => acc + curr.gpa, 0) / result.length;

  const response = {
    AverageGPA,
  };

  return res.status(200).json(response);
};

const getAverageGpaOfStudentInSemesterHandler = handler;

export default getAverageGpaOfStudentInSemesterHandler;
