import Image from "next/image"
import { useEffect } from "react"

type Props={
    iconType:string
    coverUrl:string
    iconUrl:string
}

export default function PageCover({iconType,coverUrl,iconUrl}:Props){
    useEffect(()=>{
        console.log("coverUrl",coverUrl)
    },[coverUrl])

    if((iconType==="" || iconUrl==="" || !iconUrl) && <Image src={"/horizon-atlas/file_icon.svg"} alt={''} width={20} height={20} className='relative w-20 h-20 m-0' style={coverUrl!=="" ? {top:"-40px",left:"20px"} : {marginBottom:"1.25rem"}} />)
    if(iconType==="custom_emoji")return <Image src={iconUrl} alt={''} className='relative w-20 h-20 m-0' style={coverUrl!=="" ? {top:"-40px",left:"20px"} : {marginBottom:"1.25rem"}} />
    if(iconType==="emoji")return <p className='relative w-14 h-14 text-7xl' style={coverUrl!=="" ? {top:"-40px",left:"20px"} : {marginBottom:"1.25rem"}}>{iconUrl}</p>
    return <Image src={iconUrl} alt={''} width={20} height={20} className='relative w-20 h-20 m-0' style={coverUrl!=="" ? {top:"-40px",left:"20px"} : {marginBottom:"1.25rem"}} />
}