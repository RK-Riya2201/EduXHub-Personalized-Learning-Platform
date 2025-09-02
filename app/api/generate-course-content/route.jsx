import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import axios from "axios";

// AI content generation prompt
const PROMPT = `Depends on Chapter name and Topic. Generate content for each topic in HTML and give response in JSON format.
Schema:{
 chapterName:<>,
 {
   topic:<>,
   content:<>
 }
}
: User Input:
`;

export async function POST(req) {
  try {
    const { courseJson, courseTitle, courseId } = await req.json();

    if (!courseJson?.chapters?.length) {
      return NextResponse.json({ error: "No chapters found" }, { status: 400 });
    }

    const promises = courseJson.chapters.map(async (chapter) => {
      try {
        const config = { responseMimetypes: "text/plain" };
        const model = "gemini-2.0-flash";
        const contents = [
          { role: "user", parts: [{ text: PROMPT + JSON.stringify(chapter) }] },
        ];

        const response = await ai.models.generateContent({ model, config, contents });

        const rawText = response?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) {
          throw new Error("AI did not return content.");
        }

        const jsonStr = rawText.replace(/```json|```/g, "").trim();
        const CourseData = JSON.parse(jsonStr);

        const youtubeVideo = await GetYoutubeVideo(chapter.chapterName);

        return { CourseData, youtubeVideo };
      } catch (err) {
        console.error("Error processing chapter:", chapter.chapterName, err);
        return { error: `Failed to generate content for ${chapter.chapterName}` };
      }
    });

    // Generate all chapter content
    const CourseContent = await Promise.all(promises);

    // Save to database
    await db
      .update(coursesTable)
      .set({ courseContent: CourseContent }) 
      .where(eq(coursesTable.cid, courseId));

    // Fetch saved content to verify
    const course = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.cid, courseId));

    console.log(course[0].courseContent); 

    return NextResponse.json({ courseName: courseTitle, CourseContent });
  } catch (err) {
    console.error("POST /generateCourseContent error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

async function GetYoutubeVideo(topic) {
  try {
    const params = {
      part: "snippet",
      q: topic,
      maxResults: 4,
      type: "video",
      key: process.env.YOUTUBE_API_KEY,
    };

    const resp = await axios.get("https://www.googleapis.com/youtube/v3/search", { params });
    return resp.data.items.map((item) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
    }));
  } catch (err) {
    console.error("YouTube API error:", err);
    return [];
  }
}
