import { Parent } from "@/types/Parent";
import { usePageLink } from "@/hooks/usePagePush";
import { RenderTextWithBreaks } from "../renderTextWithBreaks";
import { highlightPython } from "@/lib/codeHighLighter/python/highlight";
import { assignCssForPython } from "@/lib/codeHighLighter/python/assignCss";

type Props = {
  parent: Parent[];
};

export default function PythonCode(props: Props) {
  const { parent } = props;
  const { handleClick } = usePageLink();

  return (
    <div style={{
        backgroundColor: "rgb(250,250,250)",
        padding: "0.5rem",
        overflowX: "auto",
        whiteSpace: "pre", // ← pre に統一
      }}>
      {parent.map((p, index) => {
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
