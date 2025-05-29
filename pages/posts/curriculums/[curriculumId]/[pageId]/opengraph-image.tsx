export const runtime = 'experimental-edge';

import { CurriculumService } from '@/lib/services/CurriculumService';
import { PageDataService } from '@/lib/services/PageDataService';
import { ImageResponse } from 'next/og';

// 画像のサイズを指定
export const size = {
  width: 1200,
  height: 630,
};

// 画像のコンテンツタイプを指定
export const contentType = 'image/png';

type Params={
  curriculumId:string;
  pageId:string;
}

// 画像を生成する関数
export default async function Image({ params }: { params: Params }) {
  const { curriculumId,pageId } = params;

  const singlePost = await CurriculumService.getCurriculumById(curriculumId);
  if(curriculumId!==pageId){
    const titleAndIcon = await PageDataService.getTitleAndIcon(pageId);
    const title = titleAndIcon.title ? titleAndIcon.title : ""
    return new ImageResponse(
      (
        <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {title}
      </div>
      )
    )
  }else{
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 128,
            background: 'white',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {singlePost.title}
        </div>
      )
    );
  }

}
