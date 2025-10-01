import { assignCssForPython, highlightPython } from "@/lib/codeHighLighter/forPython";
import { Parent } from "@/types/Parent";
import { usePageLink } from "@/hooks/usePagePush";
import { RenderTextWithBreaks } from "./renderTextWithBreaks";

type Props = {
  parent: Parent[];
};

// type Range = { start: number; end: number; parent: Parent };

// function getParentForToken(tokenText: string, startIndex: number, ranges: Range[]): Parent | null {
//   const endIndex = startIndex + tokenText.length;
//   const range = ranges.find(r => r.start <= startIndex && endIndex <= r.end);
//   return range?.parent ?? null;
// }

export default function PythonCode(props: Props) {
  const { parent } = props;
  const { handleClick } = usePageLink();

  return (
    <div style={{ backgroundColor: "rgb(250,250,250)", padding: "0.5rem" }}>
      {parent.map((p, index) => {
        // 各 Parent の plain_text をハイライト
        const tokens = highlightPython(p.plain_text);

        return (
          <span key={index}>
            {tokens.map((token, i) => {
              // 改行は <br /> に置換する場合もできるが pre-wrap なら不要
              if (token.token === "\n") return <br key={i} />;
              
              return RenderTextWithBreaks(
                token.token,
                assignCssForPython(p, token.type), // 常にこの Parent を使う
                () => handleClick(p.href ?? null, p.scroll)
              );
            })}
          </span>
        );
      })}
    </div>
  );
}
