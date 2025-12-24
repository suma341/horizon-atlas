import { getColorProperty } from '@/lib/backgroundCorlor';
import { MdBlock } from '@/types/MdBlock';
import RenderParent from '../renderParent';
import { RenderChildren } from '../mdBlock';

type Props={
    mdBlock:MdBlock;
    depth:number;
    sameDepth?:number;
}

export default function BulletedListItem(props:Props) {
    try{
        const {mdBlock,depth,sameDepth} =props;
        const textData = mdBlock.parent.paragraph
        if(!textData)return;
        const colorProperty = getColorProperty(textData.color);

        const bulletedListDepth = sameDepth ?? 0;


        return (
            <div id={mdBlock.blockId}>
                <p style={colorProperty}>
                    <span className='font-bold text-xl'>{bulletedListDepth % 3===0 && "・"}</span>
                    <span className='font-bold text-xs mr-1'>{bulletedListDepth % 3===1 && "○   "}</span>
                    <span className='font-bold text-xs mr-1'>{bulletedListDepth % 3===2 && "■   "}</span>
                    {textData.parent.map((text,i)=>{
                        return <RenderParent key={i} text={text} i={i} />
                        })}
                    {textData.parent.length===0 && <span className='opacity-0' >a</span>}
                </p>
                <RenderChildren mdBlocks={mdBlock.children} depth={depth + 1} />
            </div>
        )
    }catch(e){
        throw new Error(`error in BulletedListItem error: ${e}`)
    }
}
