// use_client
import { useRouter } from "next/router";
import { useEffect } from "react";

export function usePageLink(){
    const router = useRouter()
    const {category} = router.query as {category: string | undefined}

    useEffect(()=>{},[category])

    const scrollToSection = (targetId: string) => {
        const element = document.getElementById(targetId);
        if (element) {
            const yOffset = -100; 
            const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
        element?.classList.add("highlight")
        setTimeout(()=>{
            element?.classList.remove("highlight");
        },1600)
    };

    const handleClick =(href?:string | null, scroll?:string,is_same_bp?:boolean)=>{
        if(href && href!==""){
            if(router.asPath===href){
                if(scroll){
                    scrollToSection(scroll)
                }
            }else{
                if(scroll){
                    if(category && is_same_bp){
                        const query = `?category=${category}`
                        router.push(`${href}#${scroll}${query}`)
                        return;
                    }
                    router.push(`${href}#${scroll}`)
                }else{
                    if(href.startsWith("/posts/curriculums") || href.startsWith("https://ryukoku-horizon.github.io/horizon-atlas")){
                        if(category && is_same_bp){
                            console.log("category",category,"\nis_same_bp",is_same_bp)
                            const query = `?category=${category}`
                            router.push(`${href}${query}`)
                        }
                        router.push(`${href}`)
                    }else if(!href.startsWith("http://") && !href.startsWith("https://")){
                        return;
                    }else{
                        window.open(href, '_blank')
                    }
                }
            }
        }
    }

    return {handleClick}
}