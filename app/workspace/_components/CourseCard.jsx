import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Book, LoaderCircle, PlayCircle, Settings } from "lucide-react";
import { toast } from "sonner";

function CourseCard({ course }) {
  const courseJson = course?.courseJson?.course;
  const [loading, setLoading] = useState(false);
    // Validate banner image URL
  const bannerSrc =
    course?.bannerImageUrl && course.bannerImageUrl.startsWith("http")
      ? course.bannerImageUrl
      : "/online-education.png";

  const onEnrollCourse = async () => {
    try {
      setLoading(true);
      const result = await axios.post("/api/enroll-course", {
        courseId: course?.cid,
      });

      if (result.data?.resp) {
        toast.warning("Already Enrolled");
        return;
      }

      toast.success("Course Enrolled Successfully");
    } catch (error) {
      toast.error("Server side error, please try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shadow rounded-xl mt-10 flex flex-col">
      {/* Course Banner */}
      <Image
        src={bannerSrc}
        alt={courseJson?.name || "Course banner"}
        width={400}
        height={200}
        className="w-full aspect-video rounded-t-xl object-cover"
      />

      {/* Course Info */}
      <div className="p-3 flex flex-col gap-3 flex-grow">
        <h2 className="font-bold text-lg">{courseJson?.name || "Untitled Course"}</h2>
        <p className="line-clamp-3 text-gray-400 text-sm">
          {courseJson?.description || "No description available"}
        </p>
      </div>

      {/* Actions */}
      <div className="p-4 pt-0">
        <div className="flex justify-between items-center">
          {/* Chapters */}
          <h2 className="flex items-center text-sm gap-2">
            <Book className="text-primary h-5 w-5" />
            {courseJson?.noOfChapters || 0} Chapters
          </h2>

          {/* Enroll or Generate Button */}
          {course?.courseContent?.length ? (
            <Button
              size="sm"
              onClick={onEnrollCourse}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <LoaderCircle className="animate-spin h-5 w-5" />
              ) : (
                <PlayCircle className="h-5 w-5" />
              )}
              Enroll Course
            </Button>
          ) : (
            <Link href={`/workspace/edit-course/${course?.cid}`}>
              <Button size="sm" variant="outline" className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Generate Course
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
