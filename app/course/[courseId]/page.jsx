// app/workspace/view-course/[courseId]/Course.jsx

"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

import AppHeader from '@/app/workspace/_components/AppHeader';
import ChapterListSidebar from '../_components/ChapterListSidebar';
import ChapterContent from '../_components/ChapterContent';

function Course() {
  const { courseId } = useParams();
  const [courseInfo, setCourseInfo] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetEnrollCourseById();
  }, []);

  const GetEnrollCourseById = async () => {
    try {
      setLoading(true);
      const result = await axios.get(`/api/enroll-course?courseId=${courseId}`);
      setCourseInfo(result.data);
    } catch (error) {
      console.error("Failed to fetch course:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed w-full h-screen flex items-center justify-center bg-amber-50">
        <p className="text-xl font-semibold">Loading course...</p>
      </div>
    );
  }

  return (
    <div className="fixed w-full bg-amber-50">
      <AppHeader hideSidebar={true} />
      <div className="flex gap-12">
        <ChapterListSidebar courseInfo={courseInfo} />
        <ChapterContent
          courseInfo={courseInfo}
          refreshData={GetEnrollCourseById}
        />
      </div>
    </div>
  );
}

export default Course;
