"use client"
import AppHeader from '@/app/workspace/_components/AppHeader'
import React, { useEffect, useState } from 'react'
import ChapterListSidebar from './_components/ChapterListSidebar'
import ChapterContent from './_components/ChapterContent'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { SidebarProvider } from '@/components/ui/sidebar'
import { SelectedChapterIndexContext } from '@/context/SelectedChapterIndexContext'

function Course() {
    const { courseId } = useParams();
    const [courseInfo, setCourseInfo] = useState();
    const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);

    useEffect(() => {
        GetEnrollCourseById();
    }, []);

    const GetEnrollCourseById = async () => {
        const result = await axios.get('/api/enroll-course?courseId=' + courseId);
        setCourseInfo(result.data);
    };

    return (
        <SidebarProvider>
            <SelectedChapterIndexContext.Provider
                value={{ selectedChapterIndex, setSelectedChapterIndex }}
            >
                <AppHeader hideSideBar={true} />

                <div className="flex gap-10">
                    <ChapterListSidebar courseInfo={courseInfo} />
                    <ChapterContent
                        courseInfo={courseInfo}
                        refreshData={GetEnrollCourseById}
                    />
                </div>
            </SelectedChapterIndexContext.Provider>
        </SidebarProvider>
    );
}

export default Course;
