export type PageInfo={
    curriculumId:string
    title: string
    iconType:string
    iconUrl: string
    coverUrl: string
    id: string
    order: number
    parentId: string
    type:"curriculum" | "info" | "answer"
    ogp:{
        first_text:string;
        image_path:string;
    }
}

// export type PostMetaData = {
//   title: string;
//   tags:string[];
//   curriculumId:string;
//   category:string;
//   visibility:string[];
//   iconType:string;
//   iconUrl:string;
//   coverUrl:string;
//   order: number;
// }