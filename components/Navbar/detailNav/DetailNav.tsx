import { pageNav } from '@/types/pageNav';
import Link from 'next/link';
import React, { useEffect, useRef } from 'react'

type Props ={
  pageNav:pageNav[];
  show?:boolean;
  isVisible:boolean;
  setIsVisible:React.Dispatch<React.SetStateAction<boolean>>;
}

function DetailNav({pageNav,show,isVisible,setIsVisible}:Props) {
  const toggleRef = useRef<HTMLDivElement>(null); // toggle要素への参照
  const toggleTargetRef = useRef<HTMLDivElement>(null); // toggleTarget要素への参照

  // ドキュメント全体のクリックを監視
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        toggleTargetRef.current &&
        !toggleTargetRef.current.contains(target) &&
        toggleRef.current &&
        !toggleRef.current.contains(target)
      ) {
        setIsVisible(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(()=>{
    if(show!==undefined){
      setIsVisible(show)
    }
  },[show])

  return (
    <>
      <div ref={toggleRef} className='mr-2 px-1 hover:bg-neutral-200'>
        <button onClick={(event) => {
                event.stopPropagation(); // クリックイベントの伝播を防ぐ
                setIsVisible((prev) => !prev); // 状態を切り替え
              }}
              className='text-neutral-500'>
          ...
        </button>
      </div>
      {isVisible && (
          <div
            id="toggleTarget" ref={toggleTargetRef}
            className="absolute bg-white p-2 rounded-xl translate-y-[40%] translate-x-[40%] shadow-2xl">
            {pageNav.map((nav,i)=>(
              <Link href={nav.id} className='z-50' key={i}>
                <p className='hover:bg-neutral-200 text-neutral-500 text-sm'>{nav.title}</p>
              </Link>
            ))}
        </div>)}
    </>
  )
}

export default DetailNav