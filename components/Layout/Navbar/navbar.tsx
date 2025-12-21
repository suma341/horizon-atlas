import { pageNav } from '@/types/pageNav';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import DetailNav from './detailNav/DetailNav';
import { IoHomeOutline } from 'react-icons/io5';
import { useRouter } from 'next/router';
import { BASIC_NAV } from '@/constants/pageNavs';

type Props ={
    pageNavs:pageNav[];
}

function Navbar(props:Props) {
    const {pageNavs} = props;
    const router = useRouter();
    const { category }= router.query as {category : string | undefined};
    const [navs,setNavs] = useState<pageNav[]>([])

    useEffect(()=>{
        const categoryNavs:pageNav[] = []
        for(const nav of pageNavs){
            if(nav.link.startsWith("/posts/course/") && !nav.link.includes("/posts/course/basic")){
                categoryNavs.push(nav)
            }
        }
        if(categoryNavs.length<2){
            setNavs(pageNavs)
            return;
        }
        if(category){
            const targetCategory = categoryNavs.find((c)=>c.title===category)
            if(targetCategory){
                const removeNavs = categoryNavs.filter((c)=>c.title!==targetCategory.title)
                if(!targetCategory.link.endsWith("?is_basic=true")){
                    removeNavs.push(BASIC_NAV)
                }
                console.log("removeNavs",removeNavs)
                const filtered = pageNavs.filter((sc)=>!removeNavs.find((rc)=>sc.title===rc.title))
                console.log("filtered",filtered)
                setNavs(filtered)
                return;
            }
        }
        if(categoryNavs[0]){
            const removeNavs = categoryNavs.filter((c)=>c.title!==categoryNavs[0].title)
            if(!categoryNavs[0].link.endsWith("?is_basic=true")){
                removeNavs.push(BASIC_NAV)
            }
            const filtered = pageNavs.filter((sc)=>!removeNavs.find((rc)=>sc.title===rc.title))
            setNavs(filtered)
            return;
        }
        setNavs(pageNavs)
    },[])

    return (
        <>
            <nav className='pl-4 bg-white duration-100 pty-1'>
                {navs.length>3 && <div className='flex'>
                    <div className='flex'>
                        <Link href={navs[0].link} className='pr-2 pt-0.5 pb-1 pl-1 hover:bg-neutral-200 text-neutral-500'>
                            <IoHomeOutline size={18} />
                        </Link>
                        <p className='cursor-default text-neutral-500'>/</p>
                        <DetailNav pageNav={navs.slice(1,-2)} />
                        <p className='cursor-default text-neutral-500'>/</p>
                        <Link href={navs[navs.length - 2].link} className='px-2 pt-0.5 pb-1 hover:bg-neutral-200 text-neutral-500 truncate max-w-[clamp(100px, 20vw, 250px)]'>
                            {navs[navs.length - 2].title}
                        </Link>
                        <p className='cursor-default text-neutral-500'>/</p>
                        <Link href={navs[navs.length - 1].link} className='px-2 pt-0.5 pb-1 hover:bg-neutral-200 text-neutral-500 truncate max-w-[clamp(100px, 20vw, 250px)]'>
                            {navs[navs.length - 1].title}
                        </Link>
                    </div>
                </div>}
                {navs.length<=3 && <div className='flex'>
                    {navs.map((nav, i)=>(
                        <div className='flex gap-1.5' key={i}>
                            {i===0 && <Link href={nav.link} className='pr-2 pt-0.5 pl-1 pb-1 hover:bg-neutral-200 text-neutral-500'>
                                <IoHomeOutline size={18} />
                            </Link>}
                            {i!==0 && <Link href={nav.link} className='px-2 pt-0.5 pb-1 hover:bg-neutral-200 text-neutral-500 truncate max-w-[clamp(100px, 20vw, 250px)]'>
                                {nav.title}
                            </Link>}
                            {i + 1 < navs.length && <p className='cursor-default text-neutral-500'>/</p>}
                        </div>
                        )
                    )}
                </div>}
            </nav>
        </>
    )
}

export default Navbar;