import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { OpenRouter } from "@openrouter/sdk";
import { eq } from "drizzle-orm";
import axios from "axios";

/* 🔴 PROMPT — UNCHANGED */
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
    const { courseId, courseJson, courseTitle } = await req.json();

    /* ✅ 1. SAFELY PARSE courseJson */
    const parsedCourseJson =
      typeof courseJson === "string"
        ? JSON.parse(courseJson)
        : courseJson;

    if (!parsedCourseJson?.course?.chapters) {
      console.error("Invalid courseJson structure:", parsedCourseJson);
      return NextResponse.json(
        { error: "Invalid course structure" },
        { status: 400 }
      );
    }

    const chapters = parsedCourseJson.course.chapters;

    /* ✅ 2. INIT OPENROUTER (per Quickstart docs) */
    const openRouter = new OpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "AI Course Generator",
      },
    });

    /* ✅ 3. GENERATE CONTENT FOR EACH CHAPTER */
    const promises = chapters.map(async (chapter) => {
      const response = await openRouter.chat.send({
        model: "openrouter/auto",
        messages: [
          {
            role: "user",
            content:
              PROMPT +
              JSON.stringify({
                chapterName: chapter.chapterName,
                topics: chapter.topics,
              }),
          },
        ],
        stream: false,
      });

      const rawText = response?.choices?.[0]?.message?.content;

      if (!rawText) {
        throw new Error("AI did not return content");
      }

      const cleanJson = rawText.replace(/```json|```/g, "").trim();
      const JSONResp = JSON.parse(cleanJson);

      /* ✅ 4. FETCH YOUTUBE VIDEOS */
      const youtubeVideo = await GetYoutubeVideo(chapter.chapterName);

      return {
        ...JSONResp,
        youtubeVideo,
      };
    });

    const CourseContent = await Promise.all(promises);

    /* ✅ 5. SAVE TO DATABASE */
    await db
      .update(coursesTable)
      .set({
        courseContent: CourseContent,
      })
      .where(eq(coursesTable.cid, courseId));

    /* ✅ 6. RESPONSE */
    return NextResponse.json({
      courseName: courseTitle,
      CourseContent,
    });
  } catch (error) {
    console.error("generate-course-content error:", error);
    return NextResponse.json(
      { error: "Failed to generate course content" },
      { status: 500 }
    );
  }
}

/* ✅ YOUTUBE HELPER — CORRECT */
const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/search";

const GetYoutubeVideo = async (topic) => {
  const resp = await axios.get(YOUTUBE_BASE_URL, {
    params: {
      part: "snippet",
      q: topic,
      maxResults: 4,
      type: "video",
      key: process.env.YOUTUBE_API_KEY,
    },
  });

  return resp.data.items.map((item) => ({
    videoId: item.id?.videoId,
    title: item.snippet?.title,
  }));
};
