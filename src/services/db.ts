import { collection, doc, setDoc, getDoc, getDocs, query, updateDoc, deleteDoc, where, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Collection names
const STUDENTS_COLLECTION = "students";
const ATTENDANCE_COLLECTION = "attendance";
const ASSIGNMENTS_COLLECTION = "assignments";
const CUSTOM_SLOTS_COLLECTION = "timetable_slots";
const STUDY_MATERIALS_COLLECTION = "materials_and_papers";

export interface StudyMaterial {
  id?: string;
  title: string;
  type: "material" | "paper";
  paperType?: "internal" | "external"; // for exam papers: Internal (Mid-Sem) vs External (End-Sem)
  category?: string;
  subject: string;
  code?: string;
  unitOrYear?: string;
  url: string;
  faculty?: string;
  description?: string;
  createdAt?: string;
}

export interface CustomSlot {
  id?: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  date?: string; // Optional specific date e.g. "2026-09-15"
  time: string; // e.g. "5:30 PM - 6:30 PM"
  timeStart: string; // e.g. "5:30"
  subject: string; // e.g. "Operating System"
  code: string; // e.g. "C54"
  faculty: string; // e.g. "Prof. VLD"
  type: "Lecture" | "Lab";
  theme?: "cyan" | "blue" | "emerald" | "purple" | "amber" | "rose";
  createdAt?: string;
}

export interface Assignment {
  id?: string;
  title: string;       // assignment name
  faculty: string;     // faculty name
  subject: string;     // subject
  dueDate: string;     // due date
  driveUrl?: string;   // Google Drive link
  createdAt?: string;
}

export interface Student {
  pid: string;
  name: string;
  password?: string;
  phone?: string;
  email?: string;
  rollNo?: number;
  isBlocked?: boolean;
  status?: "PRESENT" | "ABSENT" | "UNMARKED"; // Used for UI state
}

/**
 * Add or update a student
 */
export async function addStudent(
  pid: string, 
  name: string, 
  password = "password", 
  phone = "", 
  email = "", 
  rollNo?: number
) {
  const studentRef = doc(db, STUDENTS_COLLECTION, pid.toUpperCase());
  await setDoc(studentRef, {
    name,
    password,
    phone,
    email,
    rollNo: rollNo || parseInt(pid.replace(/\D/g, ""), 10) || null,
    isBlocked: false,
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
export async function updateStudent(
  pid: string, 
  updates: {
    name?: string;
    password?: string;
    phone?: string;
    email?: string;
    isBlocked?: boolean;
  }
) {
  const studentRef = doc(db, STUDENTS_COLLECTION, pid.toUpperCase());
  await updateDoc(studentRef, updates);
}

/**
 * Toggle blocked state for a student
 */
export async function toggleBlockStudent(pid: string, isBlocked: boolean) {
  const studentRef = doc(db, STUDENTS_COLLECTION, pid.toUpperCase());
  await updateDoc(studentRef, { isBlocked });
}

/**
 * Get all registered students
 */
export async function getAllStudents(): Promise<Student[]> {
  const querySnapshot = await getDocs(collection(db, STUDENTS_COLLECTION));
  const students: Student[] = [];
  querySnapshot.forEach((doc) => {
    if (doc.id !== "ADMIN001") {
      const data = doc.data();
      students.push({
        pid: doc.id,
        name: data.name,
        phone: data.phone || "",
        email: data.email || "",
        rollNo: data.rollNo || parseInt(doc.id.replace(/\D/g, ""), 10) || 0,
        isBlocked: !!data.isBlocked,
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
export async function getStudentByPid(pid: string): Promise<Student | null> {
  const docRef = doc(db, STUDENTS_COLLECTION, pid.toUpperCase());
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      pid: docSnap.id,
      name: data.name || "Student",
      phone: data.phone || "",
      email: data.email || "",
      rollNo: data.rollNo,
      password: data.password,
      isBlocked: !!data.isBlocked,
    };
  }
  return null;
}

/**
 * Find student by PID, Email, or Phone
 */
export async function findStudent(identifier: string) {
  const clean = identifier.trim();
  if (!clean) return null;

  // 1. Direct PID lookup (safe against path delimiters)
  try {
    const cleanPid = clean.replace(/[\/\\]/g, "").toUpperCase();
    if (cleanPid) {
      const docRef = doc(db, STUDENTS_COLLECTION, cleanPid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { pid: docSnap.id, ...docSnap.data() };
      }
    }
  } catch (e) {
    console.error("PID lookup error:", e);
  }
  
  // 2. Lookup by email
  try {
    const emailQuery = query(collection(db, STUDENTS_COLLECTION), where("email", "==", clean.toLowerCase()));
    const emailSnap = await getDocs(emailQuery);
    if (!emailSnap.empty) {
      const first = emailSnap.docs[0];
      return { pid: first.id, ...first.data() };
    }
  } catch (e) {
    console.error("Email lookup error:", e);
  }

  // 3. Lookup by phone
  try {
    const phoneQuery = query(collection(db, STUDENTS_COLLECTION), where("phone", "==", clean));
    const phoneSnap = await getDocs(phoneQuery);
    if (!phoneSnap.empty) {
      const first = phoneSnap.docs[0];
      return { pid: first.id, ...first.data() };
    }
  } catch (e) {
    console.error("Phone lookup error:", e);
  }

  return null;
}

/**
 * Mark Attendance for a specific class slot on a date
 */
export async function saveAttendance(
  dateStr: string, 
  lectureName: string, 
  records: Record<string, "PRESENT" | "ABSENT" | undefined>, 
  isCancelled = false
) {
  // We use a combination of Date and Lecture as the document ID to prevent duplicates
  // e.g., "2026-09-11_Computer Fundamental (AAP)"
  const docId = `${dateStr}_${lectureName}`;
  const attendanceRef = doc(db, ATTENDANCE_COLLECTION, docId);
  
  await setDoc(attendanceRef, {
    date: dateStr,
    lecture: lectureName,
    records,
    isCancelled,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

/**
 * Set lecture cancellation status
 */
export async function setLectureCancellation(dateStr: string, lectureName: string, isCancelled: boolean) {
  const docId = `${dateStr}_${lectureName}`;
  const attendanceRef = doc(db, ATTENDANCE_COLLECTION, docId);
  
  await setDoc(attendanceRef, {
    date: dateStr,
    lecture: lectureName,
    isCancelled,
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
    const data = docSnap.data();
    return {
      records: (data.records || {}) as Record<string, "PRESENT" | "ABSENT">,
      isCancelled: !!data.isCancelled
    };
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
    // Do NOT count cancelled lectures in attendance statistics
    if (data.isCancelled) return;
    
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
    } else if (subjectName.toLowerCase().includes("lab")) {
      faculty = "LAB";
    }
    
    // Remove faculty from subject name -> "Computer Fundamental"
    subjectName = subjectName.split(" (")[0].trim();
    
    if (!stats[subjectName]) {
      stats[subjectName] = { present: 0, total: 0, faculties: {} };
    }
    
    if (!stats[subjectName].faculties[faculty]) {
      stats[subjectName].faculties[faculty] = { present: 0, total: 0 };
    }
    
    if (records) {
      const studentStatus = records[pid.toUpperCase()];
      // Only count towards this student's stats if the student was marked PRESENT or ABSENT
      if (studentStatus === "PRESENT" || studentStatus === "ABSENT") {
        stats[subjectName].total += 1;
        stats[subjectName].faculties[faculty].total += 1;
        
        if (studentStatus === "PRESENT") {
          stats[subjectName].present += 1;
          stats[subjectName].faculties[faculty].present += 1;
        }
      }
    }
  });
  
  return stats;
}

export interface AttendanceHistoryItem {
  date: string;
  lecture: string;
  subject: string;
  faculty: string;
  status: "PRESENT" | "ABSENT";
  isCancelled?: boolean;
}

/**
 * Get detailed attendance history for a specific student
 */
export async function getStudentAttendanceHistory(pid: string): Promise<AttendanceHistoryItem[]> {
  const q = query(collection(db, ATTENDANCE_COLLECTION));
  const querySnapshot = await getDocs(q);
  
  const history: AttendanceHistoryItem[] = [];
  
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const records = data.records;
    const lecture = data.lecture || "";
    const date = data.date; // e.g. "2026-09-11"
    const isCancelled = !!data.isCancelled;
    
    let subjectName = lecture.split(" - ")[1] || lecture;
    let faculty = "Unknown";
    const facultyMatch = subjectName.match(/\(([^)]+)\)/);
    if (facultyMatch) {
      faculty = facultyMatch[1];
    } else if (subjectName.toLowerCase().includes("lab")) {
      faculty = "LAB";
    }
    subjectName = subjectName.split(" (")[0].trim();
    
    if (records && records[pid.toUpperCase()]) {
      history.push({
        date: date,
        lecture: lecture,
        subject: subjectName,
        faculty: faculty,
        status: records[pid.toUpperCase()],
        isCancelled: isCancelled
      });
    } else if (isCancelled) {
      history.push({
        date: date,
        lecture: lecture,
        subject: subjectName,
        faculty: faculty,
        status: "ABSENT",
        isCancelled: true
      });
    }
  });
  
  // Sort descending (newest first)
  return history.sort((a, b) => {
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
    // Do NOT count cancelled lectures
    if (data.isCancelled) return;
    
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

/**
 * Add a new assignment
 */
export async function addAssignment(assignment: Omit<Assignment, "id">) {
  const colRef = collection(db, ASSIGNMENTS_COLLECTION);
  const docRef = await addDoc(colRef, {
    ...assignment,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
}

/**
 * Get all assignments
 */
export async function getAssignments(): Promise<Assignment[]> {
  const querySnapshot = await getDocs(collection(db, ASSIGNMENTS_COLLECTION));
  const assignments: Assignment[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    assignments.push({
      id: doc.id,
      title: data.title || "",
      faculty: data.faculty || "",
      subject: data.subject || "",
      dueDate: data.dueDate || "",
      driveUrl: data.driveUrl || "",
      createdAt: data.createdAt || ""
    });
  });
  // Sort descending by createdAt
  return assignments.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

/**
 * Delete an assignment
 */
export async function deleteAssignment(id: string) {
  const docRef = doc(db, ASSIGNMENTS_COLLECTION, id);
  await deleteDoc(docRef);
}

/**
 * Add a new custom timetable slot
 */
export async function addCustomSlot(slot: Omit<CustomSlot, "id">): Promise<string> {
  const colRef = collection(db, CUSTOM_SLOTS_COLLECTION);
  const docRef = await addDoc(colRef, {
    ...slot,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
}

/**
 * Get all custom timetable slots
 */
export async function getCustomSlots(): Promise<CustomSlot[]> {
  const querySnapshot = await getDocs(collection(db, CUSTOM_SLOTS_COLLECTION));
  const slots: CustomSlot[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    slots.push({
      id: doc.id,
      day: data.day,
      date: data.date || "",
      time: data.time || "",
      timeStart: data.timeStart || (data.time ? data.time.split(" ")[0] : ""),
      subject: data.subject || "",
      code: data.code || "",
      faculty: data.faculty || "",
      type: data.type || "Lecture",
      theme: data.theme || "blue",
      createdAt: data.createdAt || ""
    });
  });
  return slots.sort((a, b) => (a.timeStart || "").localeCompare(b.timeStart || ""));
}

/**
 * Delete a custom timetable slot
 */
export async function deleteCustomSlot(id: string): Promise<void> {
  const docRef = doc(db, CUSTOM_SLOTS_COLLECTION, id);
  await deleteDoc(docRef);
}

/**
 * Add a new study material or exam paper
 */
export async function addStudyMaterial(item: Omit<StudyMaterial, "id">): Promise<string> {
  const colRef = collection(db, STUDY_MATERIALS_COLLECTION);
  const docRef = await addDoc(colRef, {
    ...item,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
}

/**
 * Get all study materials and exam papers
 */
export async function getStudyMaterials(typeFilter?: "material" | "paper"): Promise<StudyMaterial[]> {
  const querySnapshot = await getDocs(collection(db, STUDY_MATERIALS_COLLECTION));
  const items: StudyMaterial[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (!typeFilter || data.type === typeFilter) {
      items.push({
        id: doc.id,
        title: data.title || "",
        type: data.type || "material",
        paperType: data.paperType || (
          data.type === "paper"
            ? ((data.category && (data.category.toLowerCase().includes("mid") || data.category.toLowerCase().includes("internal"))) || (data.title && (data.title.toLowerCase().includes("mid") || data.title.toLowerCase().includes("internal"))) ? "internal" : "external")
            : undefined
        ),
        category: data.category || (data.type === "paper" ? "Question Paper" : "Lecture Notes"),
        subject: data.subject || "",
        code: data.code || "",
        unitOrYear: data.unitOrYear || "",
        url: data.url || "",
        faculty: data.faculty || "",
        description: data.description || "",
        createdAt: data.createdAt || ""
      });
    }
  });
  // Sort descending by createdAt
  return items.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

/**
 * Delete a study material or exam paper
 */
export async function deleteStudyMaterial(id: string): Promise<void> {
  const docRef = doc(db, STUDY_MATERIALS_COLLECTION, id);
  await deleteDoc(docRef);
}

