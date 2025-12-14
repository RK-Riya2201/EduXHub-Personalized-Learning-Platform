import React, { useContext } from 'react'
import { Accordion,AccordionItem,AccordionContent,AccordionTrigger } from "@/components/ui/accordion"
import { SelectedChapterIndexContext } from '@/context/SelectedChapterIndexContext';
import { CheckCircle, X, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import YouTube from 'react-youtube';

function ChapterContent({ courseInfo ,refreshData}) {
  const { course, enrollCourse } = courseInfo;
  const courseContent = courseInfo?.courses?.courseContent;
  const { SelectedChapterIndex, setSelectedChapterIndex } = useContext(SelectedChapterIndexContext);
  const videoData = courseContent?.[selectedChapterIndex]?.youtubeVideo;
  const topics = courseContent?.[selectedChapterIndex]?.courseData?.topics;
  let completedChapter = enrollCourse?.completedChapter??[];

  const markChapterCompleted =async() => {

      completedChapter.push(selectedChapterIndex);
      const result = await axios.put('api/enroll-course', {
        courseId: courseId,
        completedChapter: completedChapter
      });
      console.log(result);
      refreshData();
      toast.success('Chapter Marked as Completed!!')
    }
  }

  return (
    <div className='p-12 ml-80 mt-25'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold'>
          {selectedChapterIndex + 1}. {courseContent?.[selectedChapterIndex]?.courseData?.chapterName}
          </h2>
        {!completedChapter?.includes(selectedChapterIndex) ?
          <Button onClick={() => markChapterCompleted()}><CheckCircle />Mark as Completed</Button> :
          <Button variant={outline}><X />Mark Incomplete</Button>}
      </div>
      <h2 className='text-lg font-bold my-2'>Related Videos</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {videoData?.map((video, index) =>index<3 && (
          <div key={index}>
            <YouTube videoId={video?.videoId}
              opts={{
                height: '200', width: '250'
              }} />
          </div>
        ))}
      </div>

      <div className='mt-6'>
        {topics.map((topic, index) => (
          <div key={index} className='mt-10 p-4 rounded-2xl bg-purple-500'>
            <h2 className='text-2xl text-primary font-bold'>{index + 1}.{topic?.topic}</h2>
            {/*<p>{topic?.content}</p>*/}
            <div dangerouslySetInnerHTML={{ _html: topic?.content }}
              style={{
                lineHeight: '1',
            }}></div>
          </div>
        ))}
      </div>
    </div>
  )


export default ChapterContent