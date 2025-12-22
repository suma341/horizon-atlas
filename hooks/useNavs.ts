import { BASIC_NAV } from "@/constants/pageNavs";
import { pageNav } from "@/types/pageNav";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const useNavs=(pageNavs:pageNav[])=>{
    const router = useRouter();
    const { category }= router.query as {category : string | undefined};
    const [navs,setNavs] = useState<pageNav[]>([])

    useEffect(()=>{
        const rewriteLinks:pageNav[] = pageNavs.map((n)=>{
            if(!category)return n
            if(n.link.startsWith("/posts/curriculums/")){
                const query = `?category=${category}`
                return {
                    title:n.title,
                    link:`${n.link}${query}`
                }
            }
            return n
        })
        const categoryNavs:pageNav[] = []
        for(const nav of rewriteLinks){
            if(nav.link.startsWith("/posts/course/") && !nav.link.includes("/posts/course/basic")){
                categoryNavs.push(nav)
            }
        }
        if(categoryNavs.length<2){
            setNavs(rewriteLinks)
            return;
        }
        if(category){
            const targetCategory = categoryNavs.find((c)=>c.title===category)
            if(targetCategory){
                const removeNavs = categoryNavs.filter((c)=>c.title!==targetCategory.title)
                if(!targetCategory.link.endsWith("?is_basic=true")){
                    removeNavs.push(BASIC_NAV)
                }
                const filtered = rewriteLinks.filter((sc)=>!removeNavs.find((rc)=>sc.title===rc.title))
                setNavs(filtered)
                return;
            }
        }
        if(categoryNavs[0]){
            const removeNavs = categoryNavs.filter((c)=>c.title!==categoryNavs[0].title)
            if(!categoryNavs[0].link.endsWith("?is_basic=true")){
                removeNavs.push(BASIC_NAV)
            }
            const filtered = rewriteLinks.filter((sc)=>!removeNavs.find((rc)=>sc.title===rc.title))
            setNavs(filtered)
            return;
        }
        setNavs(rewriteLinks)
    },[pageNavs])

    useEffect(()=>{console.log("navs",navs)},[navs.length])

    return {
        navs
    }
}