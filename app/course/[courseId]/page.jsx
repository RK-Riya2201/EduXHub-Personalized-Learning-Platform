
"use client"
import AppHeader from '@/app/workspace/_components/AppHeader'
import React, { useState } from 'react'
import ChapterListSidebar from '../_components/ChapterListSidebar'
import { useEffect } from 'react'
import { useParams } from 'next/navigation'

function Course() {

  const { courseId } = useParams();
  const { courseInfo, setCourseInfo } = useState();

  useEffect(()=> {
          GetEnrollCourseById();
      },[])
      const GetEnrollCourseById = async() => {
          const result = await axios.get('/api/enroll-course?courseId='+courseId);
          console.log(result.data);
          setCourseInfo(result.data);
  }
  
  return (
      <div className='fixed w-full bg-amber-50'>
          <AppHeader hideSidebar={true} />
          <div className='flex gap-12'>
              <ChapterListSidebar courseInfo={courseInfo} />
        <ChapterContent courseInfo={courseInfo} refreshData={() => GetEnrollCourseById()} />
          </div>
    </div>
  )
}

export default Course