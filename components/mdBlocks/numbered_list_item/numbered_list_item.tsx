import { getColorProperty } from '@/lib/backgroundCorlor';
import { assignCss } from '@/lib/assignCssProperties';
import { usePageLink } from '@/hooks/usePagePush';
import { renderTextWithBreaks } from '../renderTextWithBreaks';
import { MdBlock } from '@/types/MdBlock';
import { RenderChildren } from '../mdBlock';

type Props={
    mdBlock:MdBlock;
    depth:number;
    listNumber?:number
}

export default function NumberedListItem(props:Props) {
    try{
        const {mdBlock,depth,listNumber} =props;
        const textData = mdBlock.parent.paragraph
        const { handleClick } = usePageLink()
        if(!textData)return;
        const colorProperty = getColorProperty(textData.color);

        const numberDepth = listNumber ?? 1;

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
            <RenderChildren mdBlocks={mdBlock.children} depth={depth +1} />
        </div>
    )
    }catch(e){
        throw new Error(`error in number_list_item: ${e}`)
    }
}
