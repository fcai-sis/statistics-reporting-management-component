import { StudentSemesterModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

/*
 * Get the count of students in a specific semester
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

  // find students in the specified semester
  const result = await StudentSemesterModel.find({
    semester: semesterId,
  });

  // If the students are not found, return a 404 error
  if (!result.length) {
    return res.status(404).json({
      errors: [
        {
          message: "No students found in the semester",
        },
      ],
    });
  }

  const studentCount = result.length;

  const response = {
    studentCount,
  };

  return res.status(200).json(response);
};

const getStudentCountInSemesterHandler = handler;

export default getStudentCountInSemesterHandler;
