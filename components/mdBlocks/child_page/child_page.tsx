"use client";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MdBlock } from 'notion-to-md/build/types';
import React from 'react';
import Image from 'next/image';

type Props = {
  mdBlock: MdBlock;
};

export default function ChildPage(props: Props) {
  const { mdBlock } = props;
  const title = mdBlock.parent.split('## ')[1]; // 子ページのタイトルを取得
  const id = mdBlock.blockId;
  const router = useRouter();
  const { slug, childId } = router.query;

  // 現在のパスを適切に初期化
  const currentPathArray = Array.isArray(childId)
    ? childId.filter(Boolean) // 空要素を除去
    : childId
    ? [childId]
    : []; // 初期値を空配列に設定

  const newPath = `/posts/post/${slug}/${[...currentPathArray, id].join('/')}`.replace(/\/+/g, '/'); 

  if(mdBlock.children.length===0){
    return null;
  }

  return (
      <Link href={newPath} id={mdBlock.blockId}>
        <div className=' my-0.5 py-1 px-0.5 hover:bg-neutral-100 cursor-pointer text-neutral-500 underline flex'>
        <Image src={'/horizon-atlas/file_icon.svg'} alt={''} height={20} width={20} className='w-5 h-5 m-0 mr-0.5' />{title}
        </div>
      </Link>
  );
}
