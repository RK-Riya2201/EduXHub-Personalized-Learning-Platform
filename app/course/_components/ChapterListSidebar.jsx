import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


function ChapterListSidebar({ courseInfo }) {
  const course = courseInfo?.courses;
  const enrollCourse = courseInfo?.enrollCourse;
  const courseContent = courseInfo?.courses.courseContent;
  const {SelectedChapterIndex, setSelectedChapterIndex}=useContext(SelectedChapterIndexContext)
  return (
      <div className='w-85px p-4 bg-secondary h-screen'>ChapterListSidebar
      <h2 className='mt-3 font-bold text-2xl'>Chapters { courseContent?.length}</h2>
      <Accordion type="single" collapsible>
        
        {courseContent?.map((chapter, index) => (
          <AccordionItem value={chapter?.courseData?.chapterName} key={index}
          onClick={()=>setSelectedChapterIndex(index)}>
            <AccordionTrigger className={'text-lg font-medium'}>{index + 1}.{chapter?.courseData?.chapterName}</AccordionTrigger>
          <AccordionContent asChild>
              <div>{chapter?.courseData?.topics.map((topic, index) => (
                <h2 className='p-3 my-1 bg-purple-300 rounded-2xl'>
                  key={index}{topic?.topic}</h2>
              ))}</div>
          </AccordionContent>
          </AccordionItem>
        ))}
  
</Accordion>

          </div>
  )
}

export default ChapterListSidebar