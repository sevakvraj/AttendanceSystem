import { NextResponse } from 'next/server';
import { addStudent } from '@/services/db';

export async function GET() {
  try {
    // Add the admin to the students collection
    await addStudent("admin001", "admin admin", "crbhaihai");
    return NextResponse.json({ success: true, message: "Admin added to database!" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message });
  }
}
