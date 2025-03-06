import React from 'react';
import { pageNav } from '@/types/pageNav';
import Link from 'next/link';
import UserBlock from '../Header/UserInfo/userBlock';
import { IoIosSearch } from 'react-icons/io';
import { useAuth0 } from '@auth0/auth0-react';
import { FaArrowTrendUp } from "react-icons/fa6";
import { PiSignOut } from "react-icons/pi";
import { MdOutlineEmail } from 'react-icons/md';
import useCurriculumIdStore from '@/stores/curriculumIdStore';

type Props={
    openbar:boolean;
    setOpenbar:React.Dispatch<React.SetStateAction<boolean>>;
    pageNav?:{
        title:string;
        childPages?:pageNav[];
    }
}

function Sidebar({openbar,setOpenbar,pageNav}:Props) {
    const { user,logout } = useAuth0();
    const { curriculumId } = useCurriculumIdStore();

    const getPageHeight = () => {
        if(window!==undefined){
            const pageHeight = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight
              );
              return pageHeight;
        }
    };

    return (
        <>
            {openbar &&<div 
                onClick={()=>setOpenbar(false)}
                className='bg-black opacity-45 fixed w-full top-0 block md:hidden' style={{height:`${getPageHeight()}px`,zIndex:"9998"}}>
                </div>}
                <div className='fixed w-7/12 top-0 right-0 block md:hidden bg-white duration-700 h-screen'
                style={openbar ? { transform: "translateX(0px)", zIndex: "9999" } : { transform: "translateX(130%)" }}>
                <div className="h-full overflow-y-auto p-3">
                    <ul>
                        <li className='flex items-center justify-between mr-5'>
                            <div></div>
                            <p onClick={() => setOpenbar(false)} className='cursor-pointer text-4xl text-neutral-500'>×</p>
                        </li>
                        <li className='flex items-center justify-between mr-5 mt-3'>
                            <div></div>
                            <div className='flex'>
                                <p className='mr-1 mt-3 text-neutral-500 text-sm'>{user?.given_name}</p>
                                <UserBlock />
                            </div>
                        </li>
                        <li className='mt-3 hover:bg-neutral-100'>
                            <Link href={'/search'}>
                                <div className='flex items-center justify-between mr-5 py-2 px-2'>
                                    <IoIosSearch size={25} className='text-neutral-600' />
                                    <div className='text-neutral-500 font-bold'>
                                        カリキュラム検索
                                    </div>
                                </div>
                            </Link>
                        </li>
                        <li className='mt-3 hover:bg-neutral-100'>
                            <Link href={'/user/progress'}>
                                <div className='flex items-center justify-between mr-5 py-2 px-2'>
                                    <FaArrowTrendUp size={25} className='text-neutral-600' />
                                    <div className='text-neutral-500 font-bold'>
                                        進捗度
                                    </div>
                                </div>
                            </Link>
                        </li>
                        <li className='mt-3 hover:bg-neutral-100'>
                            <Link href={'https://docs.google.com/forms/d/e/1FAIpQLScW_wz_h2Yd5ij50k8vH91EPUn_0EenEOJ9M147bcVl8KTQLA/viewform?usp=dialog'} target='_brank' rel="noopener noreferrer">
                                <div className='flex items-center justify-between mr-5 py-2 px-2'>
                                    <MdOutlineEmail size={25} className='text-neutral-600' />
                                    <div className='text-neutral-500 font-bold'>
                                        改善要請
                                    </div>
                                </div>
                            </Link>
                        </li>
                        <li className='mt-2'>
                            {pageNav !== undefined && (
                                <div className='p-1 border border-neutral-400 rounded'>
                                    <p className='text-base'>{pageNav.title}</p>
                                    {pageNav.childPages!==undefined && pageNav.childPages.map((nav, i) => (
                                        <Link key={i} href={`/posts/curriculums/${curriculumId}/${nav.id}`} className="my-1.5 text-sm text-neutral-500 underline truncate">
                                            <div className="p-0.5 mt-1 cursor-pointer hover:bg-neutral-100">
                                                {nav.title}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </li>
                        <div>
                            <li className='mt-3 hover:bg-neutral-100 cursor-pointer' onClick={()=>logout({logoutParams:{returnTo:process.env.NEXT_PUBLIC_ROOT_PATH!}})}>
                                <div className='flex items-center justify-between mr-5 py-2 px-2'>
                                    <PiSignOut size={25} className='text-red-400' />
                                    <div className='text-red-400 font-bold'>
                                        ログアウト
                                    </div>
                                </div>
                            </li>
                        </div>
                    </ul>
                </div>
            </div>

        </>
    )
}

export default Sidebar