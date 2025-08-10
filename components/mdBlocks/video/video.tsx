import { usePageLink } from "@/hooks/usePagePush";
import { assignCss } from "@/lib/assignCssProperties";
import { Parent } from "@/types/Parent";
import { MdBlock } from "notion-to-md/build/types";

type Props = {
    mdBlock: MdBlock;
    depth: number;
};

type VideoData ={
    parent:Parent[];
    url:string;
}

const VideoBlock=(props:Props)=>{
    const {mdBlock} = props
    const data:VideoData = JSON.parse(mdBlock.parent)

    const { handleClick } = usePageLink()

    return (
        <div id={mdBlock.blockId} className="flex-col items-center flex">
            <video src={data.url} controls style={{width:"100%",height:"auto"}} />
            <p className='text-sm m-0 text-neutral-600' style={{width: "fit-content", textAlign: "left"}}>
                {data.parent.map((text)=>{
                    const style = assignCss(text)
                    return text.plain_text.split("\n").map((line,index)=>{
                        return (<>
                            <span key={index} style={style} onClick={()=>handleClick(text.href,text.scroll)}>{line}</span>
                            {text.plain_text.split("\n")[1] && <br />}
                        </>)
                    })})}
                {data.parent.length===0 && <span className='opacity-0' >a</span>}
            </p>
        </div>
    )
}

export default VideoBlock;