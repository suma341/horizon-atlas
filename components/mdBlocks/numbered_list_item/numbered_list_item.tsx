import MdBlockComponent from '../mdBlock';
import { getColorProperty } from '@/lib/backgroundCorlor';
import { assignCss } from '@/lib/assignCssProperties';
import { usePageLink } from '@/hooks/usePagePush';
import { renderTextWithBreaks } from '../renderTextWithBreaks';
import { MdBlock } from '@/types/MdBlock';

type Props={
    mdBlock:MdBlock;
    depth:number;
    sameDepth?:number;
}

export default function NumberedListItem(props:Props) {
    try{
        const {mdBlock,depth,sameDepth} =props;
        const textData = mdBlock.parent.paragraph
        const { handleClick } = usePageLink()
        if(!textData)return;
        const colorProperty = getColorProperty(textData.color);

        const numberDepth = sameDepth ?? 1;

    return (
        <div className='my-1.5' id={mdBlock.blockId}>
            <p style={colorProperty}>
                <span>{numberDepth}.  </span>
                {textData.parent.map((text)=>{
                    const style = assignCss(text)
                    return renderTextWithBreaks(text.plain_text,style,()=>handleClick(text.href,text.scroll,text.is_same_bp))
                })}
                {textData.parent.length===0 && <span className='opacity-0' >a</span>}
            </p>
            {mdBlock.children.map((child,i)=>
                <div key={i} style={{marginLeft:(depth + 1) * 16}}>
                    <MdBlockComponent mdBlock={child} depth={depth +1} sameDepth={child.type==="numbered_list_item" ? numberDepth + 1 : undefined} />
                </div>
            )}
        </div>
    )
    }catch(e){
        throw new Error(`error in number_list_item: ${e}`)
    }
}
