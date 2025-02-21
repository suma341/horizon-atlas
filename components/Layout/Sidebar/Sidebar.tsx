import React,{useEffect, useState} from 'react';
import { pageNav } from '@/types/pageNav';
import Link from 'next/link';
import UserBlock from '../Header/UserInfo/userBlock';
import { IoIosSearch } from 'react-icons/io';
import { RoleData } from '@/types/role';
import { useAuth0 } from '@auth0/auth0-react';
import { CustomUser } from '@/global';
import { getUsersRole } from '@/lib/getUsersRole';

type Props={
    openbar:boolean;
    setOpenbar:React.Dispatch<React.SetStateAction<boolean>>;
    pageNav?:{
        title:string;
        slug:string;
        childPages:pageNav[];
    }
    roleData:RoleData;
}

function Sidebar({openbar,setOpenbar,pageNav,roleData}:Props) {
    const { user } = useAuth0();
    const [role,setRole] = useState("");

    useEffect(()=>{
        const customUser = user as CustomUser;
        const usersRole = getUsersRole(customUser, roleData);
        setRole(usersRole);
    },[user])

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
                                <p className='mr-3 mt-3 text-neutral-500'>{role}</p>
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
                        <li className='mt-2'>
                            {pageNav !== undefined && (
                                <div className='p-1 border border-neutral-400 rounded'>
                                    <p className='text-base'>{pageNav.title}</p>
                                    {pageNav.childPages.map((nav, i) => (
                                        <div key={i} className="p-0.5 mt-1 cursor-pointer hover:bg-neutral-100">
                                            <Link href={`/posts/post/${pageNav.slug}/${nav.id}`} className="my-1.5 text-sm text-neutral-500 underline truncate">
                                                {nav.title}
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </li>
                    </ul>
                </div>
            </div>

        </>
    )
}

export default Sidebar