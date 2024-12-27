import { pageNav } from "@/types/pageNav";

export const getPageLinks=(pageNavs:pageNav[])=>{
    const pageLinks:string[] = [];
    for(let i=0;i<pageNavs.length;i++){
        let link = `/posts/${pageNavs[0].id}`;
        for(let k=0;k<i;k++){
            link = link + `/${pageNavs[k + 1].id}`;
        }
        pageLinks.push(link)
    }
    return pageLinks;
}