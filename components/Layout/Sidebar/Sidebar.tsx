import React from 'react'
import UserBlock from '../Header/UserInfo/userBlock';
import SearchField from '../Header/searchField/searchField';
import Tags from '@/components/tag/Tags';

type Props={
    openbar:boolean;
    setOpenbar:React.Dispatch<React.SetStateAction<boolean>>;
    allTags:string[];
}

function Sidebar({openbar,setOpenbar,allTags}:Props) {

    const getPageHeight = () => {
        const pageHeight = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight
        );
        return pageHeight;
    };

    return (
        <div>
            {openbar &&<div 
                onClick={()=>setOpenbar(false)}
                className='bg-black opacity-45 fixed w-full top-0' style={{height:`${getPageHeight()}px`,zIndex:"9998"}}>
                </div>}
            <div className='fixed w-7/12 top-0 right-0 block sm:hidden bg-white duration-700'
            style={openbar ? {transform: "translateX(0px)",height:`${getPageHeight()}px`,zIndex:"9999"}:{transform:"translateX(130%)"}}>
                <ul>
                    <li className='flex items-center justify-between mr-5'>
                        <div></div>
                        <p onClick={()=>setOpenbar(false)} className='cursor-pointer text-4xl text-neutral-500'>×</p>
                    </li>
                    <li className='flex items-center justify-between mr-5'>
                        <div></div>
                        <UserBlock />
                    </li>
                    <li className='px-5 mt-2'>
                        <SearchField searchKeyWord={''} />
                    </li>
                    <li className='px-5 mt-2'>
                        <Tags allTags={allTags} />
                    </li>
                    <li>
                        
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Sidebar