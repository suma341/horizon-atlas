import { pageNav } from '@/types/pageNav';
import Link from 'next/link';

type Props={
    title:string;
    childPages:pageNav[];
}

function Sidebar({title, childPages}:Props) {

    return (
        <section className='hidden md:block w-44 mt-16 ml-2'>
            <div className="bg-neutral-200 h-screen">
                <p className="truncate text-sm">{title}</p>
                <div className="pl-4">
                    {childPages.map((page,i) => (
                        <Link href={page.id} key={i} className='w-40'>
                            <p className="my-1.5 text-sm text-neutral-500 underline truncate">
                                {page.title}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Sidebar