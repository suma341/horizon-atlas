import React, { useEffect, useRef, useState } from 'react'
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

function UserBlock() {
    const { data: session } = useSession();
    const [isVisible, setIsVisible] = useState(false); // トグルの状態を管理
    const toggleRef = useRef<HTMLDivElement>(null); // toggle要素への参照
    const toggleTargetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          const target = event.target as HTMLElement;
          // toggleTargetまたはtoggleの外部がクリックされた場合に非表示
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

    if(session)
    return (
        <>
            <div
                ref={toggleRef}
                onClick={(event) => {
                  event.stopPropagation(); // クリックイベントの伝播を防ぐ
                  setIsVisible((prev) => !prev); // 状態を切り替え
                }} 
                className='flex gap-1.5 mt-2 border border-neutral-300 rounded p-1'>
                <div>
                    <Image width={20} height={20} 
                    src={session.user?.image ? session.user.image : "/user_icon.png"} alt={''}
                    className='rounded-full w-9 h-auto' />
                </div>
                <div>
                    <p className='mt-1.5 text-sm text-neutral-500'>{session?.user?.name}</p>
                </div>
            </div>
            {isVisible && (
              <div
                id="toggleTarget" ref={toggleTargetRef}
                className="z-50 border-solid border-neutral-300 border-2 absolute bg-white p-2 rounded-md w-32 translate-y-1 translate-x-[-65%]">
                <ul>
                    <button onClick={() => signOut()} className="flex relative hover:bg-slate-200 rounded-sm p-1 pr-2">
                      <p className="text-neutral-600">ログアウト</p>
                    </button>
                </ul>
            </div>)}
        </>
    )
}

export default UserBlock;