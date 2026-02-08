import { coursesTable } from "@/config/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { OpenRouter } from "@openrouter/sdk";
import { NextResponse } from "next/server";
import { db } from "@/config/db";
import axios from "axios";
import { eq } from "drizzle-orm";

const PROMPT = `Generate Learning Course depends on following details. In which Make sure to add Course Name, Description, Course Banner Image Prompt (Create a modern, flat-style 2D digital illustration representing user Topic. Include UI/UX elements such as mockup screens, text blocks, icons, buttons, and creative workspace tools. Add symbolic elements related to user Course, like sticky notes, design components, and visual aids. Use a vibrant color palette (blues, purples, oranges) with a clean, professional look. The illustration should feel creative, tech-savvy, and educational, ideal for visualizing concepts in user Course) for Course Banner in 3d format Chapter Name,, Topic under each chapters, Duration for each chapters etc, in JSON format only

Schema:
{
    "course": {
        "name": "string",
        "description": "string",
        "category": "string",
        "level": "string",
        "includeVideo": "boolean",
        "noOfChapters": "number",
        "bannerImagePrompt": "string",
        "chapters": [
            {
                "chapterName": "string",
                "duration": "string",
                "topics": [
                    "string"
                ]
            }
        ]
    }
}

User Input:`;

export async function POST(req) {
  const { courseId, ...formData } = await req.json();
  const user = await currentUser();
  const { has } = auth();
  const hasPremiumAccess = has({ plan: "Premium" });

  if (!hasPremiumAccess) {
    const existing = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.userEmail, user.primaryEmailAddress.emailAddress));

    if (existing.length >= 1) {
      return NextResponse.json({ resp: "limit exceed" }, { status: 403 });
    }
  }

  const openRouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  const response = await openRouter.chat.send({
    model: "openrouter/auto",
    messages: [
      {
        role: "user",
        content: PROMPT + JSON.stringify(formData),
      },
    ],
    stream: false,
  });

  const rawText = response.choices[0].message.content;
  const cleanJson = rawText.replace(/```json|```/g, "").trim();
  const JSONResp = JSON.parse(cleanJson);

  const bannerImageUrl = await GenerateImage(
    JSONResp.course.bannerImagePrompt
  );

  await db.insert(coursesTable).values({
    ...formData,
    courseJson: JSON.stringify(JSONResp),
    userEmail: user.primaryEmailAddress.emailAddress,
    cid: courseId,
    bannerImageUrl,
  });

  return NextResponse.json({ courseId });
}

const GenerateImage = async (imagePrompt) => {
  const resp = await axios.post(
    "https://aigurulab.tech/api/generate-image",
    {
      width: 1024,
      height: 1024,
      input: imagePrompt,
      model: "flux",
      aspectRatio: "16:9",
    },
    {
      headers: {
        "x-api-key": process.env.IMAGE_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  return resp.data.image;
};
