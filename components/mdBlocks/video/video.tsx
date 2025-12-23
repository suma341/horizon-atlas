import { usePageLink } from "@/hooks/usePagePush";
import { assignCss } from "@/lib/assignCssProperties";
import { MdBlock } from "@/types/MdBlock";
import { AtlRichTextEntity } from "@/types/pageData";

type Props = {
    mdBlock: MdBlock;
    depth: number;
};

type VideoData ={
    parent:AtlRichTextEntity[];
    url:string;
}

const VideoBlock=(props:Props)=>{
    try{
        const {mdBlock} = props
        const { handleClick } = usePageLink()
        const data = mdBlock.parent.image as VideoData
        if(!data)return;

    return (
        <div id={mdBlock.blockId} className="flex-col items-center flex">
            <video src={data.url} controls style={{width:"100%",height:"auto"}} />
            <p className='text-sm m-0 text-neutral-600' style={{width: "fit-content", textAlign: "left"}}>
                {data.parent.map((text)=>{
                    const style = assignCss(text)
                    return text.plain_text.split("\n").map((line,index)=>{
                        return (<>
                            <span key={index} style={style} onClick={()=>handleClick(text.href,text.scroll,text.is_same_bp)}>{line}</span>
                            {text.plain_text.split("\n")[1] && <br />}
                        </>)
                    })})}
                {data.parent.length===0 && <span className='opacity-0' >a</span>}
            </p>
        </div>
    )
    }catch(e){
        throw new Error(`error in video: ${e}`)
    }
}

export default VideoBlock;