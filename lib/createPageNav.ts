import { pageNav } from "@/types/pageNav";

const divide =(pageNavs:pageNav[] =[])=>{
    const child = pageNavs.filter((nav)=>nav.child);
    const parent = pageNavs.filter((nav)=>!nav.child);
    return {
        child,
        parent
    }
}

export const getPageNavs=(pageNavs:pageNav[])=>{
    const {child,parent} = divide(pageNavs);
    const pageLinks:string[] = [];
    for(let i=0;i<parent.length;i++){
        pageLinks.push(parent[i].id);
    }
    for(let i=0;i<child.length;i++){
        let link = `/posts${child[0].id}`;
        for(let k=0;k<i;k++){
            link = link + `/${child[k + 1].id}`;
        }
        pageLinks.push(link)
    }
    return pageLinks;
}
