import { StudentModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

/*
 * Get the number of students in the entire faculty
 * */
const handler = async (req: Request, res: Response) => {
  const students = await StudentModel.find();

  const totalNumberOfStudents = students.length;

  const response = {
    totalNumberOfStudents,
  };
  return res.status(200).json(response);
};

const getAllStudentsHandler = handler;

export default getAllStudentsHandler;
