import { collection, doc, setDoc, getDoc, getDocs, query, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Collection names
const STUDENTS_COLLECTION = "students";
const ATTENDANCE_COLLECTION = "attendance";

export interface Student {
  pid: string;
  name: string;
  password?: string;
  status?: "PRESENT" | "ABSENT" | "UNMARKED"; // Used for UI state
}

/**
 * Add or update a student
 */
export async function addStudent(pid: string, name: string, password = "password") {
  const studentRef = doc(db, STUDENTS_COLLECTION, pid.toUpperCase());
  await setDoc(studentRef, {
    name,
    password, // Storing plaintext for now based on requirements, consider hashing in production
    createdAt: new Date().toISOString()
  }, { merge: true });
}

/**
 * Remove a student
 */
export async function removeStudent(pid: string) {
  const studentRef = doc(db, STUDENTS_COLLECTION, pid.toUpperCase());
  await deleteDoc(studentRef);
}

/**
 * Update a student
 */
export async function updateStudent(pid: string, updates: {name?: string, password?: string}) {
  const studentRef = doc(db, STUDENTS_COLLECTION, pid.toUpperCase());
  await updateDoc(studentRef, updates);
}

/**
 * Get all registered students
 */
export async function getAllStudents(): Promise<Student[]> {
  const querySnapshot = await getDocs(collection(db, STUDENTS_COLLECTION));
  const students: Student[] = [];
  querySnapshot.forEach((doc) => {
    if (doc.id !== "ADMIN001") {
      students.push({
        pid: doc.id,
        name: doc.data().name,
        status: "UNMARKED"
      });
    }
  });
  // Sort by PID
  return students.sort((a, b) => a.pid.localeCompare(b.pid));
}

/**
 * Get a specific student by PID
 */
export async function getStudentByPid(pid: string) {
  const docRef = doc(db, STUDENTS_COLLECTION, pid.toUpperCase());
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { pid: docSnap.id, ...docSnap.data() };
  }
  return null;
}

/**
 * Mark Attendance for a specific class slot on a date
 */
export async function saveAttendance(dateStr: string, lectureName: string, records: Record<string, "PRESENT" | "ABSENT">) {
  // We use a combination of Date and Lecture as the document ID to prevent duplicates
  // e.g., "2026-09-11_Computer Fundamental (AAP)"
  const docId = `${dateStr}_${lectureName}`;
  const attendanceRef = doc(db, ATTENDANCE_COLLECTION, docId);
  
  await setDoc(attendanceRef, {
    date: dateStr,
    lecture: lectureName,
    records,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

/**
 * Get Attendance for a specific class slot on a date
 */
export async function getAttendance(dateStr: string, lectureName: string) {
  const docId = `${dateStr}_${lectureName}`;
  const docRef = doc(db, ATTENDANCE_COLLECTION, docId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data().records;
  }
  return null; // No attendance recorded yet
}

/**
 * Get all attendance records to calculate percentages for a student
 */
export async function getStudentAttendanceStats(pid: string) {
  const q = query(collection(db, ATTENDANCE_COLLECTION));
  const querySnapshot = await getDocs(q);
  
  // stats[subjectName] = { present, total, faculties: { "AAP": {present, total} } }
  const stats: Record<string, { present: number, total: number, faculties: Record<string, {present: number, total: number}> }> = {};
  
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const records = data.records;
    const lecture = data.lecture || ""; // e.g. "12:30 - Computer Fundamental (AAP)"
    
    // Parse the subject name out
    // "12:30 - Computer Fundamental (AAP)" -> "Computer Fundamental (AAP)"
    let subjectName = lecture.split(" - ")[1] || lecture;
    
    // Extract faculty if present
    let faculty = "Unknown";
    const facultyMatch = subjectName.match(/\(([^)]+)\)/);
    if (facultyMatch) {
      faculty = facultyMatch[1];
    }
    
    // Remove faculty from subject name -> "Computer Fundamental"
    subjectName = subjectName.split(" (")[0];
    
    if (!stats[subjectName]) {
      stats[subjectName] = { present: 0, total: 0, faculties: {} };
    }
    
    if (!stats[subjectName].faculties[faculty]) {
      stats[subjectName].faculties[faculty] = { present: 0, total: 0 };
    }
    
    if (records) {
      stats[subjectName].total += 1;
      stats[subjectName].faculties[faculty].total += 1;
      
      if (records[pid.toUpperCase()] === "PRESENT") {
        stats[subjectName].present += 1;
        stats[subjectName].faculties[faculty].present += 1;
      }
    }
  });
  
  return stats;
}

/**
 * Get detailed attendance history for a specific student
 */
export async function getStudentAttendanceHistory(pid: string) {
  const q = query(collection(db, ATTENDANCE_COLLECTION));
  const querySnapshot = await getDocs(q);
  
  const history: Array<{ date: string, lecture: string, subject: string, faculty: string, status: "PRESENT" | "ABSENT" }> = [];
  
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const records = data.records;
    const lecture = data.lecture || "";
    const date = data.date; // e.g. "2026-09-11"
    
    if (records && records[pid.toUpperCase()]) {
      let subjectName = lecture.split(" - ")[1] || lecture;
      let faculty = "Unknown";
      const facultyMatch = subjectName.match(/\(([^)]+)\)/);
      if (facultyMatch) {
        faculty = facultyMatch[1];
      }
      subjectName = subjectName.split(" (")[0];
      
      history.push({
        date: date,
        lecture: lecture,
        subject: subjectName,
        faculty: faculty,
        status: records[pid.toUpperCase()]
      });
    }
  });
  
  // Sort descending (newest first)
  return history.sort((a, b) => {
    // If same date, you can sort by lecture time if you parse it, but for simplicity we sort by date descending
    // We can just use string comparison for YYYY-MM-DD
    const comp = b.date.localeCompare(a.date);
    if (comp === 0) {
      return b.lecture.localeCompare(a.lecture);
    }
    return comp;
  });
}

/**
 * Get overall attendance percentages for all students
 */
export async function getClassAttendanceStats() {
  const q = query(collection(db, ATTENDANCE_COLLECTION));
  const querySnapshot = await getDocs(q);
  
  // pid -> { present: number, total: number }
  const stats: Record<string, { present: number, total: number }> = {};
  
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const records = data.records;
    
    if (records) {
      // Every student in the record counts as 1 total class (if they were evaluated)
      Object.keys(records).forEach(pid => {
        if (!stats[pid]) stats[pid] = { present: 0, total: 0 };
        stats[pid].total += 1;
        if (records[pid] === "PRESENT") {
          stats[pid].present += 1;
        }
      });
    }
  });
  
  return stats;
}
