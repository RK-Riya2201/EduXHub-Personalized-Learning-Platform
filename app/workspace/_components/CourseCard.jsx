"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

function CourseCard({ course }) {
  const courseJson = course?.courseJson?.course;

  // Validate banner image URL
  const bannerSrc =
    course?.bannerImageUrl && course.bannerImageUrl.startsWith("http")
      ? course.bannerImageUrl
      : "/online-education.png";

  return (
    <div className="shadow rounded-xl mt-10 flex flex-col">
      {/* Course Banner */}
      <Image
        src={bannerSrc}
        alt={courseJson?.name || "Course banner"}
        width={400}
        height={200}
        className="rounded-t-xl"
      />

      {/* Course Info */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-bold text-lg">{courseJson?.name || "Untitled Course"}</h3>
        <p className="text-sm text-muted-foreground">
          {courseJson?.description || "No description provided."}
        </p>
        <Button className="mt-2 w-full">View Course</Button>
      </div>
    </div>
  );
}

export default CourseCard;
