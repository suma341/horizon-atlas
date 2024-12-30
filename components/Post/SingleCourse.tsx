import React from 'react';
import Link from 'next/link';

type Props={
    course:string;
}

const SingleCourse = (props:Props) => {
    const {course} = props;
  return (
    <Link href={course==='基礎班カリキュラム' ? `/posts/course/basic` :`/posts/course/${course}/1`}>
        <section className='bg-slate-50 mb-4 mx-auto rounded-md p-3 shadow-2xl hover:shadow-none hover:translate-y-1 hover:bg-neutral-100 transition-all duration-300'>
            <div className=''>
                <h2 className='text-xl font-medium mb-2 mr-1'>
                    {course}
                </h2>
            </div>
        </section>
    </Link>
  )
}

export default SingleCourse;