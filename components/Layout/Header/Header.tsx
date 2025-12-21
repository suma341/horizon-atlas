import React from 'react'
import HamburgerButton from './hamburgerButton./hamburgerButton';
import UserIcon from './UserInfo/userIcon';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowTrendUp } from 'react-icons/fa6';
import { FaInfoCircle } from 'react-icons/fa';
import { MdOutlineQuestionAnswer } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import useUserProfileStore from '@/stores/userProfile';
import { useRouter } from 'next/router';

type Props={
    setOpenbar:React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({setOpenbar}:Props){
    const { userProfile} = useUserProfileStore()
    const router = useRouter()
    
  return (
    <header className='w-full bg-white'>
        <div className=" text-white px-5 mb-0 flex justify-between items-center">
            <Link href={"/posts"}>
                <Image src={'/horizon-atlas/logo_.png'} alt={''} width={32} height={16} className='w-32 h-11 absolute top-[-8%] left-0.5' />
            </Link>
            <ul className="hidden md:flex items-center pt-2 text-sm duration-100">
                {userProfile && <>
                    <li className="mr-4">
                        <Link href={'/user/setting'}>
                            <div className="text-neutral-400 hover:text-purple-500 flex flex-col items-center text-center">
                                <FaRegUser size={22} />
                                <p>ユーザー</p>
                            </div>
                        </Link>
                    </li>
                    <li className="mr-4">
                        <Link href={'/user/progress'}>
                            <div className="text-neutral-400 hover:text-purple-500 flex flex-col items-center text-center">
                                <FaArrowTrendUp size={22}/>
                                <p>進捗度</p>
                            </div>
                        </Link>
                    </li>
                    <li className="mr-4">
                        <Link href={'/posts/answers'}>
                            <div className="text-neutral-400 hover:text-purple-500 flex flex-col items-center text-center">
                                <MdOutlineQuestionAnswer size={22} />
                                <p>解答</p>
                            </div>
                        </Link>
                    </li>
                    <li className="mr-4">
                        <Link href={'/posts/infos'}>
                            <div className="text-neutral-400 hover:text-purple-500 flex flex-col items-center text-center">
                                <FaInfoCircle size={22} />
                                <p>部活情報</p>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <UserIcon />
                    </li>
                </>}
                {!userProfile && <li>
                    <button onClick={()=>{router.push("/")}} className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 active:bg-purple-800 transition">
                        ログイン
                    </button>
                </li>}
            </ul>
            <ul className='flex md:hidden items-center text-sm pt-2'>
                <li>
                    <HamburgerButton setOpenSide={setOpenbar} />
                </li>
            </ul>
        </div>
    </header>
  )
}
