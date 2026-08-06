// Shapes returned by the Project 2 Spring Boot API.

export interface Student {
  studentId: number;
  fullName: string;
  email: string;
  phone: string | null;
  dateOfBirth: string | null;
  level: number;
  program: string;
}

export interface Outstanding {
  studentId: number;
  fullName: string;
  totalBilled: number;
  totalPaid: number;
  outstanding: number;
}

export interface Enrollment {
  courseCode: string;
  courseTitle: string;
  creditHours: number;
  lecturer: string;
  academicYear: string;
  semester: number;
  grade: string | null;
}

export interface Payment {
  paymentId: number;
  amount: number;
  paidOn: string;
  method: string;
  reference: string | null;
}

export interface Course {
  courseId: number;
  courseCode: string;
  courseTitle: string;
  creditHours: number;
  lecturer: string;
  academicYear: string;
  semester: number;
}

export interface LecturerCourse {
  courseCode: string;
  courseTitle: string;
  lecturer: string;
  academicYear: string;
  semester: number;
}

export interface LecturerTa {
  lecturer: string;
  ta: string;
  courseCode: string;
  academicYear: string;
}

// ---- admin ----
export interface AdminStudent {
  studentId: number;
  fullName: string;
  email: string;
  phone: string | null;
  level: number;
  totalBilled: number;
  totalPaid: number;
  outstanding: number;
}

export interface Option {
  id: number;
  label: string;
}

export interface LecturerCourseRow {
  assignmentId: number;
  courseCode: string;
  courseTitle: string;
  lecturer: string;
  academicYear: string;
  semester: number;
}

export interface LecturerTaRow {
  assignmentId: number;
  lecturer: string;
  ta: string;
  courseCode: string;
  academicYear: string;
}

export interface AdminCourse {
  courseId: number;
  code: string;
  title: string;
  creditHours: number;
  level: number;
  semester: number;
}

export interface AuthResult {
  token: string;
  role: "STUDENT" | "ADMIN";
  displayName: string;
  student: Student | null;
}

export interface Me {
  student: Student;
  outstanding: Outstanding;
}
