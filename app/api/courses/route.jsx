import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

//for fetching the data
export async function GET(req) {

    //to get course id
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    const result = await db.select().from(coursesTable).where(eq(coursesTable.cid, courseId));

    console.log(result);

    return NextResponse.json(result[0]);

    
}