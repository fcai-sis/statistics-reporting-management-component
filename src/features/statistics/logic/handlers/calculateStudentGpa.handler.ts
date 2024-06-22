import { EnrollmentModel, StudentModel } from "@fcai-sis/shared-models";
import env from "../../../../env";
import { Request, Response } from "express";

/*
 * Gets all the grades of a student in a specific semester
 * */

type HandlerRequest = Request<
  {
    studentId: string;
  },
  {},
  {}
>;
const handler = async (req: HandlerRequest, res: Response) => {
  const { studentId } = req.params;
  // find all passed enrollments for the student for the specific semester
  const student = await StudentModel.findById(studentId).populate("bylaw");
  const passedEnrollments = await EnrollmentModel.find({
    student: studentId,
    status: "PASSED",
  }).populate("course");

  // each enrollment has a grades object consisting of termWork and finalExam
  const grades = passedEnrollments.map((enrollment) => {
    const creditHours = enrollment.course.creditHours;
    const grade = enrollment.grades.termWork + enrollment.grades.finalExam;
    let weight = 0;
    // loop over the bylaw.gradeWeights map and find the grade weight
    student.bylaw.gradeWeights.forEach((bylawWeight: any, key: any) => {
      if (
        grade >= bylawWeight.percentage.min &&
        grade <= bylawWeight.percentage.max
      ) {
        weight = bylawWeight.weight;

        enrollment.enrollmentMark = key;
        enrollment.save();
      }
    });

    return {
      weight,
      creditHours,
    };
  });

  // call calculateGpa endpoint
  const studentGpa = await fetch(`${env.GRADING_API}/calculate-gpa`, {
    method: "POST",
    body: JSON.stringify({
      marks: grades,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response = await studentGpa.json();

  return res.status(200).json(response);
};

const calculateStudentGpaHandler = handler;

export default calculateStudentGpaHandler;
