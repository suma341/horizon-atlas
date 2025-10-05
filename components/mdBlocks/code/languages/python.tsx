import { Parent } from "@/types/Parent";
import { usePageLink } from "@/hooks/usePagePush";
import { RenderTextWithBreaks } from "../renderTextWithBreaks";
import { assignCssForPython } from "@/lib/codeHighLighter/python/assignCss";
import { highlightCode } from "@/lib/codeHighLighter/python/highlight";
import { pythonRules } from "@/lib/codeHighLighter/languageRules/python";

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
        whiteSpace: "pre",
      }}>
      {parent.map((p, index) => {
        const tokens = highlightCode(p.plain_text,pythonRules);

        return (
          <span key={index}>
            {tokens.map((token, i) => {
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
