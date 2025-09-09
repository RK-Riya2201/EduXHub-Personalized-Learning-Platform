"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from 'axios';
import { Button } from "@/components/ui/button";
import AddNewCourseDialog from "./AddNewCourseDialog";
import { useUser } from "@clerk/nextjs";

function CourseList() {
  const [courseList, setCourseList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    user && GetCourseList();
  },[user]
  )

const GetCourseList=async()=>
{
  const result = await axios.post('/api/courses');
  console.log(result.data);
}

  return (
    <div className="mt-12">
      <h2 className="font-bold text-3xl">Course List</h2>

      {courseList?.length === 0 ? (
        <div className="flex flex-col p-5 items-center justify-center bg-secondary rounded-2xl">
          <Image
            src="/online-education.png" // ✅ correct path for public folder
            alt="education"
            width={80}
            height={80}
          />
          <h2 className="my-2 text-lg">No course created by you yet...</h2>
          <AddNewCourseDialog>
            <Button> + Add New Course </Button>
          </AddNewCourseDialog>
        </div>
      ) : (
        <div>List of Courses</div>
      )}
    </div>
  );
}

export default CourseList;
