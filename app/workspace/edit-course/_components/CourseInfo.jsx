"use client";

import { Book, Clock, TrendingUp } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import axios from "axios";

function CourseInfo({ course }) {
  const courseLayout = course?.courseJson?.course;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const GenerateCourseContent = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/generate-course-content", {
        courseJson: courseLayout,
        courseTitle: course?.name,
        courseId: course?.cid,
      });
      console.log(result.data);
      setLoading(false);
      router.replace("/workspace");
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return (
    <div className="md:flex gap-5 justify-between p-5 rounded-2xl shadow">
      <div className="flex flex-col gap-3">
        <h2 className="font-bold text-3xl">
          {courseLayout?.name || "Untitled Course"}
        </h2>
        <p className="line-clamp-3 text-gray-500">
          {courseLayout?.description || "No description available."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="flex gap-5 items-center p-3 rounded-lg shadow">
            <Clock className="text-gray-500" />
            <section>
              <h2 className="font-bold">Duration</h2>
              <h2>{courseLayout?.duration || "N/A"}</h2>
            </section>
          </div>

          <div className="flex gap-5 items-center p-3 rounded-lg shadow">
            <Book className="text-green-500" />
            <section>
              <h2 className="font-bold">Chapters</h2>
              <h2>{courseLayout?.chapters?.length || 0}</h2>
            </section>
          </div>

          <div className="flex gap-5 items-center p-3 rounded-lg shadow">
            <TrendingUp className="text-red-500" />
            <section>
              <h2 className="font-bold">Difficulty Level</h2>
              <h2>{course?.level || "N/A"}</h2>
            </section>
          </div>
        </div>

        <Button onClick={GenerateCourseContent} disabled={loading}>
          {loading ? "Generating..." : "Generate Course"}
        </Button>
      </div>

      <Image
        src={course?.bannerImageUrl}
        alt={"banner Image"}
        width={400}
        height={400}
        className="w-full mt-5 md:mt-0 object-cover aspect-auto h-[240px] rounded-2xl"
      />
    </div>
  );
}

export default CourseInfo;
