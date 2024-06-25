import { EnrollmentModel, StudentModel } from "@fcai-sis/shared-models";
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

  // each enrollment consists of a termWorkMark, finalExamMark, and grade
  const grades = passedEnrollments.map((enrollment) => {
    const creditHours = enrollment.course.creditHours;
    const grade = enrollment.termWorkMark + enrollment.finalExamMark;
    let weight = 0;
    // loop over the bylaw.gradeWeights map and find the grade weight
    student.bylaw.gradeWeights.forEach((bylawWeight: any, key: any) => {
      if (
        grade >= bylawWeight.percentage.min &&
        grade <= bylawWeight.percentage.max
      ) {
        weight = bylawWeight.weight;

        enrollment.grade = key;
        enrollment.save();
      }
    });

    return {
      weight,
      creditHours,
    };
  });

  // call calculateGpa
  const studentGpa = calculateGPA(grades);

  if (!studentGpa) {
    return res.status(500).json({
      message: "Error calculating GPA",
    });
  }

  const response = {
    GPA: studentGpa.gpa,
    totalCreditHours: studentGpa.totalCreditHours,
  };

  return res.status(200).json(response);
};

function calculateGPA(marks: { weight: number; creditHours: number }[]) {
  try {
    // Initialize variables to store total weighted grade points and total credit hours
    let totalGradePoints = 0;
    let totalCreditHours = 0;

    // Iterate through the list of marks
    for (const mark of marks) {
      // Retrieve the grade value from the grading system based on the mark

      // Calculate grade points
      const gradePoints = mark.weight * mark.creditHours;

      // Add to total weighted grade points and total credit hours
      totalGradePoints += gradePoints;
      totalCreditHours += mark.creditHours;
    }

    // Calculate GPA
    const gpa = totalGradePoints / totalCreditHours;

    // Round GPA to two decimal places
    const roundedGPA = Math.round(gpa * 100) / 100;

    // Return the calculated GPA alongside the total credit hours
    return {
      gpa: roundedGPA,
      totalCreditHours,
    };
  } catch (error: any) {
    return null;
  }
}

const calculateStudentGpaHandler = handler;

export default calculateStudentGpaHandler;
