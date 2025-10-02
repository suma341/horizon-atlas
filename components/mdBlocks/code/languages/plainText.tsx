import { Parent } from "@/types/Parent";
import { usePageLink } from "@/hooks/usePagePush";
import { assignCss } from "@/lib/assignCssProperties";
import { RenderTextWithBreaks } from "../renderTextWithBreaks";

type Props = {
  parent: Parent[];
};

export default function PlainTextCode(props: Props) {
  const { parent } = props;
  const { handleClick } = usePageLink();

  return (
    <div style={{ backgroundColor: "rgb(250,250,250)", padding: "0.5rem" }}>
      {parent.map((p) => {
        const style = assignCss(p);
        return RenderTextWithBreaks(p.plain_text,style,()=>handleClick(p.href,p.scroll))
      })}
    </div>
  );
}
