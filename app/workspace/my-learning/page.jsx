import React from 'react'
import WelcomeBanner from '../_components/WelcomeBanner'
import EnrollCourseList from '../_components/EnrollCourseList'

function MyLearning() {
  return (
    <div className="px-6 py-4">
      <div className='p-5 bg-purple-600 rounded-xl'>
          <h2 className='font-bold text-3xl text-white'>My Learning</h2>
          <p className='text-white'>Explore My Learning Section</p>
      </div>

      <div className="mt-6">
        <EnrollCourseList />
      </div>
    </div>
  )
}

export default MyLearning
