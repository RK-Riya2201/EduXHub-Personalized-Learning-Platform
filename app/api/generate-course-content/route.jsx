import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { ai } from "../generate-course-layout/route"
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
    const { courseId, courseJson, courseTitle } = await req.json();

  
    try {
        const promises = courseJson?.chapters?.map(async (chapter) => {
            const model = 'gemini-2.0-flash';
            const contents = [
                {
                    role: 'user',
                    parts: [{ text: PROMPT + JSON.stringify(chapter) }],
                },
            ];

            const response = await ai.models.generateContent({
                model,
                contents
            });
          
                 const RawResp = response?.candidates[0]?.content?.parts[0]?.text;
            const RawJson = RawResp.replace('```json', '').replace('```', '').trim();
            const JSONResp = JSON.parse(RawJson);

            //GET Youtube Videos

            const youtubeData = await GetYoutubeVideo(chapter?.chapterName);
            console.log({
                youtubeVideo: youtubeData,
                courseData: JSONResp,
            })
            return {
                youtubeVideo: youtubeData,
                courseData: JSONResp,
            };
        });


    // Generate all chapter content
    const CourseContent = await Promise.all(promises);

    // Save to database
        const dbResp = await db.update(coursesTable).set({
            courseContent: CourseContent,
        }).where(eq(coursesTable.cid, courseId));

        return NextResponse.json({
            courseName: courseTitle,
            CourseContent: CourseContent,
        });

    } catch (error) {
        
        console.error("Error in generate-course-content API:", error);
        return new NextResponse("Failed to generate course content due to an internal error.", { status: 500 });
    }
}

const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/search"

const GetYoutubeVideo = async (topic) => {
    const params = {
        part: 'snippet',
        q: topic,
        maxResults: 4,
        type: 'video',
        key: process.env.YOUTUBE_API_KEY //Your YouTube API key    
    }
    const resp = await axios.get(YOUTUBE_BASE_URL, { params });
    const youtubeVideoListResp = resp.data.items;
    const youtubeVideoList = [];
    youtubeVideoListResp.forEach((item) => {
        const data = {
            videoId: item.id?.videoId,
            title: item?.snippet?.title
        }
        youtubeVideoList.push(data);
    });
    console.log("Youtube Video List:", youtubeVideoList);
    return youtubeVideoList;
}