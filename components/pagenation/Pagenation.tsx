import React, { Dispatch, SetStateAction } from 'react'

interface Props{
    numberOfPage:number;
    currentPage:number;
    setPage:Dispatch<SetStateAction<number>>;
}

const Pagenation =(props:Props)=> {
    const {numberOfPage, currentPage, setPage} = props;

    const pages:number[]=[];
    for(let i=0;i<numberOfPage;i++){
        pages.push(i + 1);
    }

    if(numberOfPage===1){
        return null;
    }

    return (
        <section className='mb-12 lg:w-1/2 mx-auto rounded-md p-5'>
            <ul className='flex items-center justify-center gap-4'>
                {pages.map((page, i:number)=> currentPage === page ? (
                    <li className='bg-blue-400 text-white rounded-lg w-6 h-8 relative shadow-xl' key={i}>
                        <button className='absolute shadow-2xl top-2/4  left-1/4 -translate-y-2/4'>
                            {page}
                        </button>
                    </li>
                ):
                (
                    <li className='rounded-lg w-6 h-8 relative shadow-xl' key={i}>
                        <button onClick={()=>setPage(page)} className='absolute shadow-2xl top-2/4  left-1/4 -translate-y-2/4'>
                            {page}
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default Pagenation;