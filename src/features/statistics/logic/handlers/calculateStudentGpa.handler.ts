import { EnrollmentModel } from "@fcai-sis/shared-models";
import env from "../../../../env";
import { Request, Response } from "express";

/*
 * Gets all the grades of a student in a specific semester
 * */

const TEST_BYLAW = {
  gradeWeights: {
    A: {
      weight: 4,
      percentage: {
        min: 90,
        max: 100,
      },
    },
    B: {
      weight: 3,
      percentage: {
        min: 80,
        max: 89,
      },
    },
    C: {
      weight: 2,
      percentage: {
        min: 70,
        max: 79,
      },
    },
    D: {
      weight: 1,
      percentage: {
        min: 60,
        max: 69,
      },
    },
    F: {
      weight: 0,
      percentage: {
        min: 0,
        max: 59,
      },
    },
  },
};

type HandlerRequest = Request<
  {
    studentId: string;
  },
  {},
  {}
>;
const handler = async (req: HandlerRequest, res: Response) => {
  const { studentId } = req.params;
  // const { semesterId } = req.body;
  // find all passed enrollments for the student for the specific semester
  const passedEnrollments = await EnrollmentModel.find({
    student: studentId,
    status: "PASSED",
  }).populate("course");

  console.log("passedEnrollments", passedEnrollments);

  // each enrollment has a grades object consisting of termWork and finalExam
  const grades = passedEnrollments.map((enrollment) => {
    const creditHours = enrollment.course.creditHours;
    const grade = enrollment.grades.termWork + enrollment.grades.finalExam;
    console.log("GRADE BEFORE SCALING", grade);

    // give the actual grading based on the TEST_BYLAW object
    if (grade >= TEST_BYLAW.gradeWeights.A.percentage.min) {
      return {
        grade: TEST_BYLAW.gradeWeights.A.weight,
        creditHours,
      };
    }
    if (grade >= TEST_BYLAW.gradeWeights.B.percentage.min) {
      return {
        grade: TEST_BYLAW.gradeWeights.B.weight,
        creditHours,
      };
    }
    if (grade >= TEST_BYLAW.gradeWeights.C.percentage.min) {
      return {
        grade: TEST_BYLAW.gradeWeights.C.weight,
        creditHours,
      };
    }
    if (grade >= TEST_BYLAW.gradeWeights.D.percentage.min) {
      return {
        grade: TEST_BYLAW.gradeWeights.D.weight,
        creditHours,
      };
    }
    if (grade >= TEST_BYLAW.gradeWeights.F.percentage.min) {
      return {
        grade: TEST_BYLAW.gradeWeights.F.weight,
        creditHours,
      };
    }
    return {
      grade,
      creditHours,
    };
  });

  console.log(grades);

  // call calculateGpa endpoint
  const studentGpa = await fetch(`${env.GRADING_API}/calculate-gpa`, {
    method: "POST",
    body: JSON.stringify({
      gradingSystemId: "66718cf6744f64a7a1c3c569",
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
