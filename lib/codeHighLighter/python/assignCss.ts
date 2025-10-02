import { Parent } from "@/types/Parent";
import { assignColor } from "@/lib/assignCssProperties";
import { HighlightType } from "@/types/highlight";

export function assignCssForPython(parent: Parent, highlightType: HighlightType = "none") {
  const result: React.CSSProperties[] = [
    { paddingBottom: "0.1rem", paddingTop: "0.1rem" },
  ];
  const attr = parent.annotations;
  const color = assignColor(attr.color);

  if (color !== "") result.push({ color });
  if (attr.bold) result.push({ fontWeight: 700 });
  if (attr.italic) result.push({ fontStyle: "italic" });
  if (attr.code) {
    result.push({
      backgroundColor: "rgb(235, 235, 235)",
      color: color === "" ? "rgb(244,63,94)" : color,
      paddingLeft: 4,
      paddingRight: 4,
      borderRadius: 4,
    });
  }
  if (attr.underline) result.push({ textDecorationLine: "underline" });
  if (attr.strikethrough) result.push({ textDecoration: "line-through" });
  if (parent.href) {
    result.push(attr.underline ? {} : { textDecorationLine: "underline" });
    result.push((color !== "" || attr.code) ? {} : { color: "rgb(115 115 115)" });
    if (parent.href !== "") result.push({ cursor: "pointer" });
  }

  // --- Python ハイライト ---
  switch (highlightType) {
    case "keyword":
      result.push({ color: "rgb(166, 38, 164)" });
      break;
    case "builtin":
      result.push({ color: "rgb(202, 138, 4)" });
      break;
    case "boolean":
      result.push({ color: "rgb(1, 132, 187)" });
      break;
    case "exception":
      result.push({ color: "rgb(220, 38, 38)" });
      break;
    case "functionName":
      result.push({ color: "rgb(64, 120, 242)" }); 
      break;
    case "className":
      result.push({ color: "rgb(64, 120, 242)"});
      break;
    case "string":
      result.push({ color: "rgb(22, 163, 74)" });
      break;
    case "fstring":
      result.push({ color: "rgb(217, 70, 239)" });
      break;
    case "comment":
      result.push({ color: "rgb(80, 161, 79)" }); 
      break;
    case "number":
      result.push({ color: "rgb(150, 75, 0)" }); // 茶色
      break;
  }

  return Object.assign({}, ...result);
}