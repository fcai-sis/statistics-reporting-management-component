import { NationalityEnum, StudentModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

/*
 * Get an average distribution of students' nationalities
 */
const handler = async (req: Request, res: Response): Promise<Response> => {
  const students = await StudentModel.find();

  if (students.length === 0) {
    return res.status(200).json({
      errors: [
        {
          message: "No students found",
        },
      ],
    });
  }

  // Initialize an object to count students of each nationality
  const nationalityCount: {
    [key in (typeof NationalityEnum)[number]]: number;
  } = NationalityEnum.reduce((acc, nationality) => {
    acc[nationality] = 0;
    return acc;
  }, {} as { [key in (typeof NationalityEnum)[number]]: number });

  // Count the number of students for each nationality
  students.forEach((student) => {
    if (student.nationality in nationalityCount) {
      nationalityCount[
        student.nationality as (typeof NationalityEnum)[number]
      ]++;
    }
  });

  // Calculate the percentage of students for each nationality
  const totalStudents = students.length;
  const nationalityPercentage = Object.keys(nationalityCount).reduce(
    (acc, nationality) => {
      const nationalityKey = nationality as keyof typeof nationalityCount;
      acc[nationalityKey] =
        (nationalityCount[nationalityKey] / totalStudents) * 100;
      return acc;
    },
    {} as { [key in (typeof NationalityEnum)[number]]: number }
  );

  const response = {
    distribution: nationalityPercentage,
  };

  return res.status(200).json(response);
};

const getNationalityDistHandler = handler;

export default getNationalityDistHandler;
