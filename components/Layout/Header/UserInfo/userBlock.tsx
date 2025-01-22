import React from 'react'
import UserIcon from './userIcon'
import { useSession } from 'next-auth/react';
import Image from 'next/image';

function UserBlock() {
    const { data: session } = useSession();
    if(session)
    return (
        <div className='flex gap-1.5 mt-2 border border-neutral-300 rounded p-1'>
            <div>
                <Image width={20} height={20} 
                src={session.user?.image ? session.user.image : "/user_icon.png"} alt={''}
                className='rounded-full w-9 h-auto' />
            </div>
            <div>
                <p className='mt-1.5 text-sm text-neutral-500'>{session?.user?.name}</p>
            </div>
        </div>
    )
}

export default UserBlock;