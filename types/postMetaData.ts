export type PostMetaData = {
  id: string;
  title: string;
  tags:string[];
  curriculumId:string;
  category:string;
  is_basic_curriculum:boolean;
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
  is_basic_curriculum:string;
  visibility:string;
  tag:string;
  iconType:string;
  iconUrl:string;
  coverUrl:string;
  order:number;
}