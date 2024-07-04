import {
  AcademicStudentModel,
  DepartmentModel,
  StudentModel,
} from "@fcai-sis/shared-models";
import { Request, Response } from "express";

/*
 * Gets the top 50 students based on their GPA for each department
 * */

type DepartmentCode = String | "GENERAL";
type HandlerRequest = Request<
  {},
  {},
  {},
  {
    major?: DepartmentCode;
    level?: string;
    limit?: string;
  }
>;
const getTopStudentsHandler = async (req: HandlerRequest, res: Response) => {
  const { major, level, limit } = req.query;
  const levelNumber = level ? parseInt(level) : undefined;
  const limitNumber = limit ? parseInt(limit) : 50;

  const department = await DepartmentModel.findOne({ code: major });

  const matchFilter: any = {
    $match: {
      ...(major !== "GENERAL"
        ? { major: department?._id }
        : { major: { $exists: false } }),
      ...(levelNumber ? { level: levelNumber } : {}),
    },
  };

  const students = await AcademicStudentModel.aggregate([
    matchFilter,
    {
      $lookup: {
        from: StudentModel.collection.name,
        localField: "student",
        foreignField: "_id",
        as: "student",
      },
    },
    {
      $unwind: {
        path: "$student",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $project: {
        _id: 0,
        gpa: "$gpa",
        major: "$major",
        level: "$level",
        fullName: "$student.fullName",
        studentId: "$student.studentId",
      },
    },
    {
      $sort: {
        gpa: -1,
      },
    },
    {
      $limit: limitNumber,
    },
  ]);

  return res.status(200).json({ students });
};

export default getTopStudentsHandler;
