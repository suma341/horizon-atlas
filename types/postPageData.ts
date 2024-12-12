import { PostMetaData } from "@/types/postMetaData";

export type PostPageData = {
    post: {
      metadata:PostMetaData,
      markdown: { parent:string },
    };
  };
