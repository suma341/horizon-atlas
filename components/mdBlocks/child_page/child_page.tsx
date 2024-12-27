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
  const id = mdBlock.blockId;
  const router = useRouter();
  const { slug, childId } = router.query;

  const currentPathArray = Array.isArray(childId) ? childId : [childId];
  const newPath = `/posts/${slug}/${[...currentPathArray, id].join('/')}`;

  console.log(newPath);
  return (
    <div className='my-2'>
      <Link href={newPath} className="text-neutral-500 underline hover:text-neutral-600">
        {title}
      </Link>
    </div>
  );
}