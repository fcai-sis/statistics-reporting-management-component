import { StudentSemesterModel, StudentModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

/*
 * Get the worst-performing student in a specific semester
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

  // Find the student with the lowest GPA in the specified semester
  const worstStudentSemester = await StudentSemesterModel.findOne({
    semesterId: semesterId,
  }).sort({
    cumulativeGpa: 1,
  });

  // Find the student with the lowest GPA in the specified semester
  const worstStudent = await StudentModel.findById(
    worstStudentSemester.studentId
  );

  // If the student is not found, return a 404 error
  if (!worstStudent) {
    return res
      .status(404)
      .json({ message: "Worst-performing student not found" });
  }

  const response = {
    worstStudent: {
      id: worstStudent._id,
      name: worstStudent.name,
      gpa: worstStudentSemester.cumulativeGpa,
    },
  };

  return res.status(200).json(response);
};

const getWorstPerformingStudentInSemesterHandler = handler;

export default getWorstPerformingStudentInSemesterHandler;
