export type PostMetaData = {
  title: string;
  tags:string[];
  curriculumId:string;
  category:string[];
  visibility:string[];
  iconType:string;
  iconUrl:string;
  coverUrl:string;
  order: number;
};

export type PostEntity={
  id:number;
  curriculumId:string;
  title:string;
  category:string;
  visibility:string;
  tag:string;
  iconType:string;
  iconUrl:string;
  coverUrl:string;
  order:number;
}