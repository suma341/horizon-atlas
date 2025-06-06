import { scrollToSection } from "@/lib/scrollToSection";
import { useRouter } from "next/router";

export function usePageLink(){
    const router = useRouter()

    const handleClick =(href:string | null, scroll:string | undefined)=>{
        if(href && href!==""){
            if(router.asPath===href){
                if(scroll){
                    scrollToSection(scroll)
                }
            }else{
                if(scroll){
                    router.push(`${href}#${scroll}`)
                }else{
                    if(!href.startsWith("http://") && !href.startsWith("https://")){
                        router.push(href)
                    }else{
                        window.open(href, '_blank')
                    }
                }
            }
        }
    }

    return {handleClick}
}