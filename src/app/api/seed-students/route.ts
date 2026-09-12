import { NextResponse } from 'next/server';
import { addStudent } from '@/services/db';

export const STUDENTS_DATA = [
  { pid: "MG26001", rollNo: 1, name: "Aagam Sunilkumar Sheth", phone: "7600828866", email: "aagamsheth66@gmail.com" },
  { pid: "MG26002", rollNo: 2, name: "Akshat Dharmeshbhai Mer", phone: "9327161621", email: "akshatmer92@gmail.com" },
  { pid: "MG26003", rollNo: 3, name: "Arshi Mahammedaslam Ganam", phone: "7434880099", email: "ganamarshi@gmail.com" },
  { pid: "MG26004", rollNo: 4, name: "Artiben Shakubhai Padhiyar", phone: "9313372260", email: "padhiyaraarti449@gmail.com" },
  { pid: "MG26005", rollNo: 5, name: "Bhavin Bharatbhai Rathod", phone: "9727846168", email: "rathodbhavin627@gmail.com" },
  { pid: "MG26006", rollNo: 6, name: "Datt Hiteshbhai Rabari", phone: "9726601224", email: "dattrabari05@gmail.com" },
  { pid: "MG26007", rollNo: 7, name: "Deep Sachinkumar Patel", phone: "9662993612", email: "deeppatel3043@gmail.com" },
  { pid: "MG26008", rollNo: 8, name: "Devanshi Jayeshkumar Patel", phone: "8141615559", email: "devanshipatel2824@gmail.com" },
  { pid: "MG26009", rollNo: 9, name: "Dhrumika Anilbhai Baraiya", phone: "9558141425", email: "dhrumikabaraiya@gmail.com" },
  { pid: "MG26010", rollNo: 10, name: "Dhruti Dinkarkumar Tandel", phone: "9409288012", email: "tandeldhruti1907@gmail.com" },
  { pid: "MG26011", rollNo: 11, name: "Dhruv Rakesh Mahuvagara", phone: "9227067925", email: "dhruvmahuvagara114488@gmail.com" },
  { pid: "MG26012", rollNo: 12, name: "Dhruv Umeshbhai Vara", phone: "9510896077", email: "dhruvvara8200@gmail.com" },
  { pid: "MG26013", rollNo: 13, name: "Gayatri Naruka", phone: "7861019325", email: "gayatrinaruka2004@gmail.com" },
  { pid: "MG26014", rollNo: 14, name: "Hardik Kiritkumar Rana", phone: "9313755890", email: "hardikrana2709@gmail.com" },
  { pid: "MG26015", rollNo: 15, name: "Harshilbhai Umeshbhai Chaudhari", phone: "9313792263", email: "shivuchaudhari141@gmail.com" },
  { pid: "MG26016", rollNo: 16, name: "Heniben Narendrabhai Patel", phone: "9376660571", email: "henipatel1262@gmail.com" },
  { pid: "MG26017", rollNo: 17, name: "Het Vijaybhai Italiya", phone: "9023950184", email: "Italiyahet123@gmail.com" },
  { pid: "MG26018", rollNo: 18, name: "Himanshu Rajeshkumar Jatav", phone: "9428454313", email: "jatavhimanshu323@gmail.com" },
  { pid: "MG26019", rollNo: 19, name: "Ishwari Anil Patil", phone: "8460092609", email: "ishwari260506@gmail.com" },
  { pid: "MG26020", rollNo: 20, name: "Jiya Mohanbhai Tandel", phone: "9601016492", email: "jiyatandel960@gmail.com" },
  { pid: "MG26021", rollNo: 21, name: "Kavya Ketansinh Thakor", phone: "7862066020", email: "thakorkjay@gmail.com" },
  { pid: "MG26022", rollNo: 22, name: "Krisha Samirkumar Patel", phone: "9409591900", email: "krisha2795@gmail.com" },
  { pid: "MG26023", rollNo: 23, name: "Krishna Santoshkumar Mishra", phone: "8929161180", email: "krishnasmishra223@gmail.com" },
  { pid: "MG26024", rollNo: 24, name: "Madhu Ramyagya Chauhan", phone: "7041958482", email: "madhuchauhan8482@gmail.com" },
  { pid: "MG26025", rollNo: 25, name: "Mahendra Panabhai Prajapati", phone: "9924197331", email: "mahendraprajapati3468@gmail.com" },
  { pid: "MG26026", rollNo: 26, name: "Manav Vinodbhai Varu", phone: "7600235299", email: "manvaru2505@gmail.com" },
  { pid: "MG26027", rollNo: 27, name: "Mayank Dilipkumar Parmar", phone: "8490031451", email: "mayankdparmar780@gmail.com" },
  { pid: "MG26028", rollNo: 28, name: "Mohammed Sadab Salauddin Gujarati", phone: "8866654662", email: "gujaratisadab404@gmail.com" },
  { pid: "MG26029", rollNo: 29, name: "Neet Jayeshkumar Patel", phone: "7567040812", email: "patelneet786@gmail.com" },
  { pid: "MG26030", rollNo: 30, name: "Nitu Rakesh Rajbhar", phone: "7990723422", email: "niturajbhar.tech@gmail.com" },
  { pid: "MG26031", rollNo: 31, name: "Palak Sureshbhai Kukna", phone: "8780476870", email: "Kuknapalak@gmail.com" },
  { pid: "MG26032", rollNo: 32, name: "Prachiben Ashvinbhai Patel", phone: "9925131373", email: "prachiapatel2535@gmail.com" },
  { pid: "MG26033", rollNo: 33, name: "Pratibha Sunilkumar Sharma", phone: "8059946959", email: "Sharmapratibha.cs@gmail.com" },
  { pid: "MG26034", rollNo: 34, name: "Prem Miteshbhai Patel", phone: "7874599845", email: "patelprem1606@gmail.com" },
  { pid: "MG26035", rollNo: 35, name: "Priyal Navalbhai Kansara", phone: "9724536722", email: "pkp784869@gmail.com" },
  { pid: "MG26036", rollNo: 36, name: "Rahulkumar Birendrabhai Sharma", phone: "9016985589", email: "rahul582000s@gmail.com" },
  { pid: "MG26037", rollNo: 37, name: "Rudra Rajeshbhai Rana", phone: "8866599600", email: "ranaravi5636@gmail.com" },
  { pid: "MG26038", rollNo: 38, name: "Rudra Rajivbhai Parekh", phone: "7383136064", email: "rudraparekh04@gmail.com" },
  { pid: "MG26039", rollNo: 39, name: "Rudresh Milankumar Dabhi", phone: "9265858272", email: "rudreshdabhi2005@gmail.com" },
  { pid: "MG26040", rollNo: 40, name: "Shravan Ramprasad Sahu", phone: "9510714559", email: "shravansahu4321@gmail.com" },
  { pid: "MG26041", rollNo: 41, name: "Shubhamkumar Nareshbhai Prajapati", phone: "8238916618", email: "shubhamprajapati3601@gmail.com" },
  { pid: "MG26042", rollNo: 42, name: "Sujal Shrikant Satturu", phone: "8734889840", email: "sujalsaturu09@gmail.com" },
  { pid: "MG26043", rollNo: 43, name: "Sunilkumar Shantibhai Sarvaiya", phone: "9157817833", email: "sarvaiyasunil25@gmail.com" },
  { pid: "MG26044", rollNo: 44, name: "Vihar Balubhai Joshi", phone: "9687830169", email: "vihar7336@gmail.com" },
  { pid: "MG26045", rollNo: 45, name: "Vijay Rudabhai Kargathiya", phone: "6351654126", email: "vijaykargathiya094@gmail.com" },
  { pid: "MG26046", rollNo: 46, name: "Vishalkumar Rajeshbhai Solanki", phone: "8511360537", email: "vishal0204s@gmail.com" },
  { pid: "MG26047", rollNo: 47, name: "Vrajkumar Pareshkumar Sevak", phone: "9427547499", email: "sevakvraj2020@gmail.com" },
  { pid: "MG26048", rollNo: 48, name: "Vruti Ashokbhai Gujarati", phone: "8849237368", email: "gujarativruti21@gmail.com" }
];

export async function GET() {
  try {
    let count = 0;
    for (const student of STUDENTS_DATA) {
      // Password set same as PID (e.g. MG26001)
      await addStudent(
        student.pid, 
        student.name, 
        student.pid, 
        student.phone, 
        student.email, 
        student.rollNo
      );
      count++;
    }
    return NextResponse.json({ 
      success: true, 
      count, 
      message: `Successfully seeded ${count} students into Firestore!` 
    });
  } catch (e: any) {
    console.error("Seeding error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
