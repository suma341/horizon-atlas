import Link from 'next/link';
import { useRouter } from 'next/router';
import { MdBlock } from 'notion-to-md/build/types';
import React from 'react';

type Props = {
  mdBlock: MdBlock;
};

export default function ChildPage(props: Props) {
  const { mdBlock } = props;
  const title = mdBlock.parent.split(' ')[1]; // 子ページのタイトルを取得
  const router = useRouter();
  const { slug, childPage } = router.query; // 現在のルートパラメータを取得
  
  const currentPathArray = Array.isArray(childPage) ? childPage : [childPage];
  
  const newPath = `/posts/${slug}/childPage${[...currentPathArray, title].join('/')}`;

  console.log(newPath);

  return (
    <div className='my-2'>
      <Link href={newPath} className="text-neutral-500 underline hover:text-neutral-600">
        {title}
      </Link>
    </div>
  );
}
