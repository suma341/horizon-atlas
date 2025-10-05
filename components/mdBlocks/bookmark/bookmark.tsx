import { MdBlock } from '@/types/MdBlock';
import { Parent } from '@/types/Parent';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  mdBlock: MdBlock;
  depth: number;
};

type BookmarkData ={
  parent:Parent[];
  url:string;
  ogp:{
    description: string | null;
    image: string | null;
    icon: string | null;
    title: string;
  }
}

export default function Bookmark(props: Props) {
  const { mdBlock } = props;
  const data:BookmarkData = JSON.parse(mdBlock.parent);

    return (
      <div className="my-2 rounded-sm border-2 border-neutral-200 hover:bg-neutral-100" id={mdBlock.blockId}>
      <Link href={data.url} target='_brank' rel="noopener noreferrer">
          <div className="flex w-full">
              <div className='m-3 w-full'>
                <p className='text-neutral-800 line-clamp-1'>{data.ogp.title}</p>
                {data.ogp.description && <p className='text-neutral-500 text-sm line-clamp-2'>{data.ogp.description}</p>}
                <div className='flex mb-0 mt-2'>
                  {data.ogp.icon &&
                  <Image src={data.ogp.icon==="https://discord.com/assets/favicon.ico" ? "/horizon-atlas/discord.ico" : data.ogp.icon} className='w-auto max-h-4 rounded-full m-0 mr-2' alt={'pageIcon'} width={30} height={30} />}
                  <p className='text-neutral-600 text-xs line-clamp-1'>
                    {data.url}
                  </p>
                </div>
              </div>
              {data.ogp.image && (
                <div className='p-0 m-0' style={{ lineHeight: 0 }}>
                    <Image src={data.ogp.image} className='w-96 h-28 rounded-sm lg:w-72' alt={''} width={30} height={30} />
                </div>
              )}
              {!data.ogp.image && <div className='w-16 h-1' />}
          </div>
      </Link>
    </div>
    )
}
