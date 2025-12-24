import { assignCss } from "@/lib/assignCssProperties";
import { MdBlock } from "@/types/MdBlock";
import Link from "next/link";

type Props={
    mdBlock:MdBlock;
    header: "col" | "row" | ""
    rowIndex:number
}

const Table_row = ({ mdBlock, header, rowIndex }: Props) => {
  try {
    const cells = mdBlock.parent.table_row;
    if (!cells) return null;

    const isHeaderRow = header === "col" && rowIndex === 0;

    return (
      <tr id={mdBlock.blockId} className={isHeaderRow ? "bg-gray-100" : ""}>
        {cells.map((cell, cellIndex) => {
          const isHeaderCol = header === "row" && cellIndex === 0;

          return (
            <td
              key={cellIndex}
              className={[
                "border p-1.5",
                isHeaderCol ? "bg-gray-100 font-medium" : "",
              ].join(" ")}
            >
              {cell.map((text, i) => {
                const style = assignCss(text);
                return text.href ? (
                  <Link href={text.href} key={i} style={style}>
                    {text.plain_text}
                  </Link>
                ) : (
                  <span key={i} style={style}>
                    {text.plain_text}
                  </span>
                );
              })}
            </td>
          );
        })}
      </tr>
    );
  } catch (e) {
    throw new Error(`error in table_row: ${e}`);
  }
};

export default Table_row;