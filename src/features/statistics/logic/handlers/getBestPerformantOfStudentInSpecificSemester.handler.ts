import { StudentSemesterModel, StudentModel } from "@fcai-sis/shared-models";
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
    semesterId: semesterId,
  }).sort({
    cumulativeGpa: -1,
  });

  // Find the student with the highest GPA in the specified semester

  const bestStudent = await StudentModel.findById(
    bestStudentSemester.studentId
  );
  if (!bestStudent) {
    return res
      .status(404)
      .json({ message: "Best-performing student not found" });
  }

  const response = {
    bestStudent: {
      id: bestStudent._id,
      name: bestStudent.name,
      gpa: bestStudentSemester.cumulativeGpa,
    },
  };

  return res.status(200).json(response);
};

const getBestPerformingStudentInSemesterHandler = handler;

export default getBestPerformingStudentInSemesterHandler;
