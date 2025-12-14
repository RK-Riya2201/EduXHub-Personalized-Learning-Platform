"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import EnrollCourseCard from "./EnrollCourseCard";

function EnrollCourseList() {
  const [enrolledCourseList, setEnrolledCourseList] = useState([]);

  useEffect(() => {
    GetEnrollCourse();
  }, []);

  const GetEnrollCourse = async () => {
    try {
      const result = await axios.get("/api/enroll-course");
      console.log(result.data);
      setEnrolledCourseList(result.data);
    } catch (error) {
      console.error("Failed to fetch enrolled courses", error);
    }
  };

  if (!enrolledCourseList?.length) return <p>No enrolled courses found.</p>;

  return (
    <div className="mt-3">
      <h2 className="font-bold text-3xl mb-5">Continue Learning Your Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {enrolledCourseList?.map((course, index) => (
          <EnrollCourseCard
            course={course?.courses}
            enrollCourse={course?.enrollCourse}
            key={index}
          />
        ))}
      </div>
    </div>
  );
}

export default EnrollCourseList;
