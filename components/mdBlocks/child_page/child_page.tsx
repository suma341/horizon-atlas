import Link from 'next/link';
import { useRouter } from 'next/router';
import { MdBlock } from 'notion-to-md/build/types'
import React from 'react'

type Props={
    mdBlock:MdBlock
}

export default function ChildPage(props:Props) {
    const {mdBlock} = props;
    const title = mdBlock.parent.split(" ")[1]
    const router = useRouter();
    const currentPath = router.asPath;
 
    return (
        <div>
            <Link href={`${currentPath}/title`} className='text-neutral-600 underline'>{title}</Link>
        </div>
    )
}

