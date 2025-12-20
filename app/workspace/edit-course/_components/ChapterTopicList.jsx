import React from 'react';
import { Gift } from 'lucide-react';

function ChapterTopicList({ course }) {
  const courseLayout = course?.courseJson?.course;

  return (
    <div>
      <h2 className="font-bold text-3xl mt-12 text-gray-800">Roadmap</h2>

      <div className="flex flex-col items-center justify-center mt-10">
        {courseLayout?.chapters.map((chapter, index) => (
          <div key={index} className="flex flex-col items-center mb-10">
            <div className="p-6 border shadow-lg rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white w-80 text-center">
              <h2 className="text-xl font-semibold">Chapter {index + 1}</h2>
              <h2 className="font-bold text-2xl mt-2">{chapter.chapterName}</h2>
              <h2 className="flex justify-between mt-4 text-sm">
                <span>No. Of Topics: {chapter?.topics?.length}</span>
              </h2>
            </div>

            <div className="mt-6 flex flex-col items-center">
              {chapter?.topics.map((topic, idx) => (
                <div className="flex flex-col items-center" key={idx}>
                  <div className="h-6 bg-gradient-to-b from-purple-300 via-purple-400 to-purple-500 w-1"></div>
                  <div className="flex items-center gap-5 mt-2">
                    <span
                      className={`${
                        idx % 2 === 0 ? "text-gray-700 font-medium" : "text-transparent"
                      } max-w-xs`}
                    >
                      {topic}
                    </span>
                    <h2 className="text-center rounded-full bg-indigo-100 text-indigo-700 px-5 py-2 font-semibold shadow-md">
                      {idx + 1}
                    </h2>
                    <span
                      className={`${
                        idx % 2 !== 0 ? "text-gray-700 font-medium" : "text-transparent"
                      } max-w-xs`}
                    >
                      {topic}
                    </span>
                  </div>

                  {idx === chapter?.topics?.length - 1 && (
                    <>
                      <div className="h-6 bg-gradient-to-b from-purple-300 via-purple-400 to-purple-500 w-1"></div>
                      <div className="flex items-center gap-5 mt-2">
                        <Gift className="text-center rounded-full bg-yellow-300 h-16 w-16 text-yellow-700 p-4 shadow-lg" />
                      </div>
                      <div className="h-6 bg-gradient-to-b from-purple-300 via-purple-400 to-purple-500 w-1"></div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="p-6 border shadow-lg rounded-2xl bg-green-600 text-white mt-5 w-40 text-center font-bold">
          Finish
        </div>
      </div>
    </div>
  );
}

export default ChapterTopicList;
