import { RenderChildren } from '../mdBlock';
import { getColorProperty } from '@/lib/backgroundCorlor';
import Image from 'next/image';
import { MdBlock } from '@/types/MdBlock';
import RenderParent from '../renderParent';

type Props={
    mdBlock:MdBlock
    depth:number;
}

export default function Callout(props:Props) {
    try{
        const {mdBlock,depth} = props;
        const data = mdBlock.parent.callout
        if(!data)return;
        const icon = data.icon
        const backgroundColor = getColorProperty(data.color)

        return (
            <div className='p-2 px-3 mb-3 mt-4 rounded relative' id={mdBlock.blockId} style={data.color==="default_background" ? {...backgroundColor,border:"solid rgb(212 212 212) 1px"} : {...backgroundColor}}>
                <div className='absolute top-2 left-2'>
                    {icon && icon.type==="emoji" && <p className='text-xl relative left-1'>{icon.emoji}</p>}
                    {icon && icon.type!=="emoji" && icon.external && <Image src={icon.external.url} alt={''} width={20} height={20} className='w-5 h-5 m-0.5 top-0.5' />}
                </div>
                <div className='ml-6'>
                    <p>
                        {Array.isArray(data.parent) && data.parent.map((text,i)=>{
                            return <RenderParent key={i} text={text} i={i} />
                        })}
                    </p>
                    <RenderChildren mdBlocks={mdBlock.children} depth={depth + 1} />
                </div>
            </div>
        )
    }catch(e){
        throw new Error(`error in callout block error: ${e}`)
    }
}
