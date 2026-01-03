import { assignCss } from '@/lib/assignCssProperties';
import { usePageLink } from '@/hooks/usePagePush';
import { MdBlock } from '@/types/MdBlock';
import * as CB from './codeBlock';

type Props = {
    mdBlock: MdBlock;
    depth: number;
};

export default function Code(props: Props) {
    try{
        const { mdBlock } = props;
    const { handleClick } = usePageLink()

    const codeOb = mdBlock.parent.code
    if(!codeOb)return;
    const codeContent = codeOb.parent.map((p)=>p.plain_text).join("").replace(/\n$/, '').replace(/\t/g, '  ')

    return (
        <div 
            id={mdBlock.blockId} 
            className='mb-2 mt-2 relative' 
        >            
            <CB.default parents={codeOb.parent} language={codeOb.language} codeContent={codeContent} />
            <p className='text-sm m-0 text-neutral-600' style={{width: "fit-content", textAlign: "left"}}>
                {codeOb.caption.map((text)=>{
                    const style = assignCss(text)
                    return text.plain_text.split("\n").map((line,index)=>{
                        return (<>
                            <span key={index} style={style} onClick={()=>handleClick(text.href,text.scroll,text.is_same_bp)}>{line}</span>
                            {text.plain_text.split("\n")[1] && <br />}
                        </>)
                    })})}
                {codeOb.caption.length===0 && <span className='opacity-0' >a</span>}
            </p>
        </div>
    );
    }catch(e){
        throw new Error(`error in code error: ${e}`)
    }
}