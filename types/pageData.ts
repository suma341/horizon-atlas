import { DatabaseBlock } from "./databaseBlock";

export type PageData={
    curriculumId:string;
    blockId:string;
    data:AtlBlockEntityData;
    parentId:string;
    type:string;
    pageId:string;
    order:number;
}

export type AtlBlockEntityData = {
  type: string;

  synced?: SyncedEntity;
  paragraph?: AtlParagraphEntity;
  todo?: AtlTodoEntity;
  header?: AtlHeaderEntity;
  image?: AtlImageEntity;
  embed?: AtlEmbedEntity;
  bookmark?: AtlBookmarkEntity;
  table?: TableEntity;
  table_row?: AtlTableRowEntity;
  child_page?: ChildPageEntity;
  link_to_page?: LinkToPageEntity;
  code?: AtlCodeEntity;
  callout?: AtlCalloutEntity;
  child_database?: DatabaseBlock;
  table_of_contents?: AtlTableOfContentsEntity;
}

type LinkToPageEntity = {
	link     :string,
	iconType :string,
	iconUrl  :string,
	title    :string,
}

type TableEntity = {
	has_column_header :boolean, 
	has_row_header    :boolean, 
	table_width      :number , 
}

type ChildPageEntity = {
	parent   :string,
	iconType :string,
	iconUrl  :string,
	coverUrl :string,
}

type SyncedEntity = string

type AnnotationsProperty = {
	bold          :boolean,   
	code          :boolean,   
	color         :string ,
	italic        :boolean,   
	strikethrough :boolean,   
	underline     :boolean,   
}

type IconProperty = {
	type        :string      ,
	external ?   :UrlProperty ,
	file      ?  :UrlProperty ,
	emoji      ? :string      ,
	custom_emoji? :UrlProperty 
}

type UrlProperty = {
	url: string 
}

type MentionEntity =  {
	content:Record<string,any>,
	type: string      
}

type OGPResult= {
	title       :string,
	description :string,
	image       :string,
	icon        :string,
}


// AtlTableOfContentsEntity
export type AtlTableOfContentsEntity = HeaderInfo[];

export type HeaderInfo= {
  header_type: number;
  block_id: string;
  text: string;
}

// AtlParagraphEntity
export type AtlParagraphEntity= {
  color: string;
  parent: AtlRichTextEntity[];
}

// AtlTodoEntity
export type AtlTodoEntity= {
  color: string;
  parent: AtlRichTextEntity[];
  checked: boolean;
}

// AtlHeaderEntity
export type AtlHeaderEntity= {
  color: string;
  parent: AtlRichTextEntity[];
  is_toggleable: boolean;
}

// AtlImageEntity
export type AtlImageEntity= {
  parent: AtlRichTextEntity[];
  url: string;
  width: number;
  height: number;
}

// AtlEmbedEntity
export type AtlEmbedEntity ={
  parent: AtlRichTextEntity[];
  url: string;
  canEmbed: boolean;
}

// AtlBookmarkEntity
export type AtlBookmarkEntity= {
  parent: AtlRichTextEntity[];
  url: string;
  ogp: OGPResult;
}

// AtlTableRowEntity
export type AtlTableRowEntity = AtlRichTextEntity[][];

// AtlCodeEntity
export type AtlCodeEntity= {
  language: string;
  caption: AtlRichTextEntity[];
  parent: AtlRichTextEntity[];
}

// AtlCalloutEntity
export type AtlCalloutEntity= {
  color: string;
  parent: AtlRichTextEntity[];
  icon: IconProperty;
}

// AtlRichTextEntity
export type AtlRichTextEntity ={
  annotations: AnnotationsProperty;
  plain_text: string;
  href?: string;
  scroll?: string;
  mention?: MentionEntity;
  is_same_bp: boolean;
}
