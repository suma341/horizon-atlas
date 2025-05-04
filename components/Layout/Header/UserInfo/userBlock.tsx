import React from 'react'
import Image from 'next/image';
import useUserProfileStore from '@/stores/userProfile';

function UserBlock() {
    const {userProfile} = useUserProfileStore()

    return (
        <div className='flex cursor-pointer gap-1.5 border border-neutral-300 rounded p-1'>
            <div>
                <Image width={20} height={20} 
                src={userProfile?.picture || ""} alt={''}
                className='rounded-full w-9 h-auto' />
            </div>
            <div>
                <p className='mt-1.5 mr-0.5 text-sm text-neutral-500'>{userProfile?.name}</p>
            </div>
        </div>
    )
}

export default UserBlock;