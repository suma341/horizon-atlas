import MdBlockComponent from '../mdBlock';
import { ParagraphData } from '@/types/paragraph';
import { getColorProperty } from '@/lib/backgroundCorlor';
import { usePageLink } from '@/hooks/usePagePush';
import { MdBlock } from '@/types/MdBlock';
import { typeAssertio } from '@/lib/typeAssertion';
import RenderParent from '../renderParent';

type Props={
    mdBlock:MdBlock;
    depth:number;
    sameDepth?:number;
}

export default function BulletedListItem(props:Props) {
    try{
        const {mdBlock,depth,sameDepth} =props;
        const textData = typeAssertio<ParagraphData>(mdBlock.parent as Record<string, string | number | boolean>, mdBlock.type)
        const colorProperty = getColorProperty(textData.color);

        const bulletedListDepth = sameDepth ?? 0;

        const { handleClick } = usePageLink();

        return (
            <div id={mdBlock.blockId}>
                <p style={colorProperty}>
                    <span className='font-bold text-xl'>{bulletedListDepth % 3===0 && "・"}</span>
                    <span className='font-bold text-xs mr-1'>{bulletedListDepth % 3===1 && "○   "}</span>
                    <span className='font-bold text-xs mr-1'>{bulletedListDepth % 3===2 && "■   "}</span>
                    {textData.parent.map((text,i)=>{
                        return <RenderParent key={i} text={text} i={i} handleClick={()=>handleClick(text.href,text.scroll)} />
                        })}
                    {textData.parent.length===0 && <span className='opacity-0' >a</span>}
                </p>
                {mdBlock.children.map((child,i)=>(
                    <div key={i} style={{marginLeft:(depth + 1) * 16}}>
                        <MdBlockComponent mdBlock={child} depth={depth +1} sameDepth={child.type==="bulleted_list_item" ? bulletedListDepth + 1 : undefined} />
                    </div>
                ))}
            </div>
        )
    }catch(e){
        throw new Error(`error in BulletedListItem error: ${e}`)
    }
}
