import { NationalityEnum, StudentModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

/*
 * Get an average distribution of students' nationalities (egyptian, foreign)
 * */
const handler = async (req: Request, res: Response) => {
  const students = await StudentModel.find();
  // filter egyptian students and foreign students
  const egyptianStudents = students.filter(
    (student) => student.nationality === NationalityEnum[0]
  );
  const foreignStudents = students.filter(
    (student) => student.nationality === NationalityEnum[1]
  );

  // get the number of egyptian students and foreign students
  const numberOfEgyptianStudents = egyptianStudents.length;
  const numberOfForeignStudents = foreignStudents.length;

  // get the percentage of egyptian students and foreign students
  const totalNumberOfStudents = students.length;
  const percentageOfEgyptianStudents =
    (numberOfEgyptianStudents / totalNumberOfStudents) * 100;
  const percentageOfForeignStudents =
    (numberOfForeignStudents / totalNumberOfStudents) * 100;

  const response = {
    numberOfEgyptianStudents,
    numberOfForeignStudents,
    percentageOfEgyptianStudents,
    percentageOfForeignStudents,
  };

  return res.status(200).json(response);
};

const getNationalityDistHandler = handler;

export default getNationalityDistHandler;
