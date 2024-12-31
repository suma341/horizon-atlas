import Link from 'next/link'
import React from 'react'

type Props = {
    allTags:string[];
}

function Tags(props:Props) {
    const {allTags} = props;
  return (
    <div className='mx-4'>
        <section className='lg:w-1/2 mb-8 mx-auto bg-slate-50 rounded-md p-5 shadow-2xl hover:shadow-none hover:translate-y-1 duration-300 transition-all'>
            <div className='font-medium mb-4'>タグ検索</div>
            <div className='flex flex-wrap gap-5'>
              {allTags.map((tag,i:number)=>(
                  <span className='cursor-pointer bg-gray-500 text-white rounded-xl px-2 pb-1/2 mr-2 mb-1 font-thin' key={i}>
                      <Link href={`/posts/tag/${tag}/1`}>{tag}</Link>
                  </span>
              ))}
            </div>
        </section>
    </div>
  )
}

export default Tags;