import Link from 'next/link'
import React from 'react'

type Props = {
    allTags:string[];
}

function Tags(props:Props) {
    const {allTags} = props;
  return (
    <div className='mx-4'>
        <section className='lg:w-1/2 mb-8 mx-auto bg-orange-200 rounded-md p-5 shadow-2xl hover:shadow-none hover:translate-y-1 duration-300 transition-all'>
            <div className='font-medium mb-4'>タグ検索</div>
            <div className='flex flex-wrap gap-5'>
              {allTags.map((tag,i:number)=>(
                  <span className='cursor-pointer text-white bg-sky-500 rounded-xl px-2 pb-1 mr-1/4 font-thin inline-block' key={i}>
                      <Link href={`/posts/tag/${tag}/page/1`}>{tag}</Link>
                  </span>
              ))}
            </div>
        </section>
    </div>
  )
}

export default Tags;