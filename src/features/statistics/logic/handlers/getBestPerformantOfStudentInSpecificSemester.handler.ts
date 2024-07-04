import { StudentSemesterModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

/*
 * Get the best-performing student in a specific semester
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

  // SELECT Max(Gpa) as Best,
  // WHERE SemesterId=SemesterX

  // Find the student with the highest GPA in the specified semester
  const bestStudentSemester = await StudentSemesterModel.findOne({
    semester: semesterId,
  })
    .sort({
      cumulativeGpa: -1,
    })
    .populate("student");

  // Find the student with the highest GPA in the specified semester

  const response = {
    bestStudent: {
      id: bestStudentSemester.student._id,
      name: bestStudentSemester.student.fullName,
      gpa: bestStudentSemester.cumulativeGpa,
    },
  };

  return res.status(200).json(response);
};

const getBestPerformingStudentInSemesterHandler = handler;

export default getBestPerformingStudentInSemesterHandler;
