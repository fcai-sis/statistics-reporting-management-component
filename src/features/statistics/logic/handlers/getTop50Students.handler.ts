import {
  DepartmentType,
  EnrollmentModel,
  SemesterModel,
  StudentModel,
  StudentSemesterModel,
} from "@fcai-sis/shared-models";
import { Request, Response } from "express";

/*
 * Gets the top 50 students based on their GPA for each department
 * */

type HandlerRequest = Request<
  {},
  {},
  {},
  {
    department: DepartmentType;
    level: number;
  }
>;
const handler = async (req: HandlerRequest, res: Response) => {
  const { department, level } = req.query;

  const latestSemester = SemesterModel.findOne({}).sort({ createdAt: -1 });

  const topStudents = await StudentSemesterModel.aggregate([
    {
      $match: {
        semester: latestSemester,
        semesterDepartment: department,
        semesterLevel: level,
      },
    },
    {
      $lookup: {
        from: StudentModel.collection.name,
        localField: "student",
        foreignField: "_id",
        as: "student",
      },
    },
    {
      $unwind: "$student",
    },
    {
      $sort: {
        GPA: -1,
      },
    },
    {
      $limit: 50,
    },
    {
      $project: {
        student: {
          studentId: 1,
          fullName: 1,
        },
        GPA: 1,
      },
    },
  ]);

  const response = {
    topStudents: topStudents.map((student: any) => {
      return {
        studentId: student.student.studentId,
        fullName: student.student.fullName,
        GPA: student.GPA,
      };
    }),
  };

  return res.status(200).json(response);
};

const getTop50StudentsHandler = handler;

export default getTop50StudentsHandler;
