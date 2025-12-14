import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  // Get courseId from query string
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get('courseId');

  // Get current user
  const user = await currentUser();

  if (courseId) {
    // Fetch single course by ID
    const result = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.cid, courseId));

    console.log(result);

    return NextResponse.json(result[0]);
  } else {
    // Fetch all courses (optionally filter by user if needed)
    const result = await db
      .select()
      .from(coursesTable)
      .orderBy(desc(coursesTable.cid)); // corrected table and column

    console.log(result);

    return NextResponse.json(result);
  }
}
