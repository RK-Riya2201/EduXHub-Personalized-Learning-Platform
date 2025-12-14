"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { Button } from "@/components/ui/button";
import AddNewCourseDialog from "./AddNewCourseDialog";
import { useUser } from "@clerk/nextjs";
import CourseCard from "./CourseCard";

function CourseList() {
  const [courseList, setCourseList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      getCourseList();
    }
  }, [user]);

  const getCourseList = async () => {
    try {
      const response = await axios.get("/api/courses");
      setCourseList(response.data || []);
    } catch (error) {
      console.error("Failed to fetch courses", error);
    }
  };

  return (
    <div className="mt-12">
      <h2 className="font-bold text-xl mb-5">Course List</h2>

      {courseList.length === 0 ? (
        <div className="flex flex-col p-5 items-center justify-center bg-secondary rounded-2xl">
          <Image
            src="/online-education.png"
            alt="education"
            width={80}
            height={80}
            priority
          />
          <h2 className="my-3 text-lg text-center">
            No course created by you yet...
          </h2>
          <AddNewCourseDialog>
            <Button>+ Add New Course</Button>
          </AddNewCourseDialog>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {courseList.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CourseList;
