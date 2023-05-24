import * as mysql from 'mysql2';

// This interface is used to represent Student and Instructor objects.
// The topic and inQueue fields are only used by students
export interface User {
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly isInstructor: boolean;
  topic?: string;
  inQueue?: boolean;
}

/*
 Converts provided array of student records/rows into student objects
 
 @param rows an array of records from the Student table
 @return students an array of student objects  
*/
export function generateStudents(rows: mysql.RowDataPacket) {
  const students: User[] = [];
  for (let i = 0; i < rows.length; i += 1) {
    const student: User = {
      email: rows[i].Email,
      firstName: rows[i].First_Name,
      lastName: rows[i].Last_Name,
      isInstructor: false,
      topic: rows[i].Topic,
    };

    if (rows[i].Queue) {
      student.inQueue = true;
    } else {
      student.inQueue = false;
    }
    students.push(student);
  }

  return students;
}

/*
 Converts provided array of instructor records/rows into instructor objects
 
 @param rows an array of records from the Instructor table
 @return instructors an array of instructor objects  
*/
export function generateInstructors(rows: mysql.RowDataPacket) {
  return rows;
}
