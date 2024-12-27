import Link from 'next/link';
import { MdBlock } from 'notion-to-md/build/types';
import React, { useEffect, useState } from 'react';

type Props = {
  mdBlock: MdBlock;
  depth: number;
};

type ogImage = {
    url?: string;
    type?: string;
};
  
type ogData = {
    ogUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogSiteName?: string;
    ogImage?: ogImage[];
};

export default function Bookmark(props: Props) {
  const { mdBlock } = props;
  const match = mdBlock.parent.match(/\((.*?)\)/g);
  const [ogpData, setOgpData] = useState<ogData>();

  useEffect(() => {
    const fetchOgpData = async () => {
      if (match) {
        const url = match[0].slice(1, -1);
        const res = await fetch(`/api/getOgp?url=${url}`);
        console.log(res);
        if(res.ok){
            const {result} = await res.json();
            const { ogUrl,ogTitle,ogDescription,ogSiteName,ogImage } = result;
            const ogData = {ogUrl, ogTitle, ogDescription, ogSiteName, ogImage};
            setOgpData(ogData);
        }
        }
    };
    fetchOgpData();
    console.log(ogpData);
  }, []);

    if (!match) {
        return null;
    }

  return (
    <div className="my-2 rounded-md border-2 border-neutral-200 p-2">
        {ogpData !==undefined && (
            <Link href={ogpData.ogUrl || ""}>
                <div className="flex">
                    <div>
                        <p>{ogpData.ogTitle}</p>
                        <p>{ogpData.ogDescription}</p>
                    </div>
                    {ogpData.ogImage !==undefined && ogpData.ogImage.length !==0 && (
                        <div>
                            <img src={ogpData.ogImage[0].url} className='w-80 h-auto' />
                        </div>
                    )}
                </div>
            </Link>
        )}
    </div>
  );
}
