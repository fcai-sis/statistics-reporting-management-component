import { StudentSemesterModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

/*
 * Get the average GPA of students in a specific semester
 * */

type HandlerRequest = Request<
  {
    semesterId: string;
  },
  {},
  {}
>;
const handler = async (req: HandlerRequest, res: Response) => {
  const { semesterId } = req.params;

  // a StudentSemester record consists of studentId, semesterId, and cumulativeGPA, so we need to get the total GPA of all students in the semester
  const result = await StudentSemesterModel.find({
    semester: semesterId,
  });

  if (!result.length) {
    return res.status(404).json({
      errors: [
        {
          message: "No students found in the semester",
        },
      ],
    });
  }
  // calculate the average GPA of all students in the semester
  const totalGpa = result.reduce(
    (acc: any, curr: any) => acc + curr.cumulativeGpa,
    0
  );
  const averageGpa = totalGpa / result.length;

  const response = {
    averageGpa,
  };
  return res.status(200).json(response);
};

const getAverageGpaOfStudentInSemesterHandler = handler;

export default getAverageGpaOfStudentInSemesterHandler;
