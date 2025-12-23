import { MdBlock } from '@/types/MdBlock';

type Props = {
    mdBlock: MdBlock;
  };

function Table_of_contents({mdBlock}:Props) {
    try{
        const headingList = mdBlock.parent.table_of_contents
        if(!headingList)return;

    const scrollToSection = (targetId: string) => {
        const element = document.getElementById(targetId);
        if (element) {
            const yOffset = -100; 
            const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
        element?.classList.add("highlight")
        setTimeout(()=>{
            element?.classList.remove("highlight");
        },1600)
    };

  return (
    <div id={mdBlock.blockId} className='w-full'>
        {headingList.map((heading,i)=>{
            return (
                <div key={i} onClick={()=>scrollToSection(heading.block_id)} className='mt-0.5 w-full py-1 rounded-md cursor-pointer hover:bg-neutral-100'>
                    {heading.header_type===1 && <p className='ml-0.5 text-neutral-500 underline'>
                        {heading.text}</p>}
                    {heading.header_type===2 && <p className='ml-5 mt-1 text-neutral-500 underline'>
                        {heading.text}</p>}
                    {heading.header_type===3 && <p className='ml-8 text-neutral-500 underline'>
                        {heading.text}</p>}
                </div>)
        })}
    </div>
  )
    }catch(e){
        throw new Error(`error in table_of_contents: ${e}`)
    }
}

export default Table_of_contents;