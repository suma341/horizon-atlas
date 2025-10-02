import { assignCss } from "@/lib/assignCssProperties";
import { MdBlock } from "@/types/MdBlock";
import { Parent } from "@/types/Parent";
import Link from "next/link";

type Props={
    mdBlock:MdBlock;
}

const Table_row=({mdBlock}:Props)=>{
    const cells:Parent[][] = JSON.parse(mdBlock.parent)

    return (
        <tr id={mdBlock.blockId}>
            {cells.map((cell,i)=>{
                return (
                    <td key={i} className="border p-1.5">
                        {cell.map((text,i)=>{
                            const style = assignCss(text)
                            return (
                                text.href ? <Link href={text.href} key={i} style={style}>{text.plain_text}</Link> :
                                <span key={i} style={style}>{text.plain_text}</span>
                            )
                        })}
                    </td>
                )
            })}
        </tr>
    )
}

export default Table_row;