import React from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { PlayCircle } from 'lucide-react';
import { Progress } from "@/components/ui/progress"



function EnrollCourseCard({ course, enrollCourse }) {
  const courseJson = course?.courseJson?.course;

  const CalculateProgress = () => {
    return ((enrollCourse?.completedChapters?.length ?? 0) / (course?.courseContent?.length ?? 1)) * 100;
  };

  return (
    <div className="shadow rounded-2xl">
      <Image
        src={course?.bannerImageUrl}
        alt={course?.name}
        width={400}
        height={300}
        className="w-full aspect-video rounded-b-xl object-cover"
      />

      <div className="p-3 flex flex-col gap-3">
        <h2 className="font-bold text-lg">{courseJson?.name}</h2>
        <p className="line-clamp-3 text-gray-500 text-sm">{courseJson?.description}</p>

        <div>
          <h2 className="flex justify-between text-primary text-sm">
            Progress <span>{CalculateProgress().toFixed(0)}%</span>
          </h2>
          <Progress value={CalculateProgress()} />

          <Link href={`/workspace/view-course/${course?.cid}`}>
            <Button className="w-full mt-4 flex items-center gap-2">
              <PlayCircle className="h-5 w-5" />
              Continue Learning
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EnrollCourseCard;
