import { Parent } from "@/types/Parent";
import { assignColor } from "@/lib/assignCssProperties";
import { pythonKeyWords } from "./keywords/python";

type HighlightType =
  | "keyword"
  | "builtin"
  | "boolean"
  | "exception"
  | "functionName"
  | "className"
  | "string"
  | "fstring"
  | "comment"
  | "number"
  | "none";

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

export function highlightPython(text: string): { token: string; type: HighlightType }[] {
  const results: { token: string; type: HighlightType }[] = [];

  let remaining = text;
  while (remaining.length > 0) {
    const newlineIndex = remaining.indexOf("\n");
    let line: string;
    if (newlineIndex !== -1) {
      line = remaining.slice(0, newlineIndex);
      remaining = remaining.slice(newlineIndex + 1);
    } else {
      line = remaining;
      remaining = "";
    }

    // コメント判定
    const commentIndex = line.indexOf("#");
    if (commentIndex !== -1) {
      const codePart = line.slice(0, commentIndex);
      const commentPart = line.slice(commentIndex);

      // コード部分
      if (codePart) results.push(...highlightPythonLine(codePart));

      // コメント部分
      results.push({ token: commentPart, type: "comment" });
    } else {
      results.push(...highlightPythonLine(line));
    }

    // 改行を保持
    if (newlineIndex !== -1) {
      results.push({ token: "\n", type: "none" });
    }
  }

  return results;
}


function highlightPythonLine(line: string): { token: string; type: HighlightType }[] {
  const tokens = line.split(/(\s+|["'()=:,])/).filter(t => t !== "");
  let highlightNextName: "def" | "class" | "" = "";
  let inString: string | null = null;
  let isFString = false;

  return tokens.map((token) => {
    let type: HighlightType = "none";

    // f文字列開始
    if (!inString && /^f["']$/.test(token)) {
      inString = token[token.length - 1];
      isFString = true;
      type = "fstring";
    }
    // 通常の文字列開始
    else if (!inString && /^["']$/.test(token)) {
      inString = token;
      isFString = false;
      type = "string";
    }
    // 文字列内部
    else if (inString) {
      if (token === inString) {
        inString = null;
        isFString = false;
        type = isFString ? "fstring" : "string";
      } else {
        type = isFString ? "fstring" : "string";
      }
    }
    // def / class キーワード
    else if (pythonKeyWords.purpleWords.includes(token)) {
      type = "keyword";
      if (token === "def" || token === "class") {
        highlightNextName = token;
      }
    }
    // 直後の名前 (関数 or クラス)
    else if (highlightNextName) {
      // 空白や記号はスキップ
      if (/^[A-Za-z_]\w*$/.test(token)) {
        type = highlightNextName === "def" ? "functionName" : "className";
        highlightNextName = "";
      }
    }
    else if (/^\d+(\.\d+)?$/.test(token)) {
      type = "number";
    }
    // その他
    else if (pythonKeyWords.yellowWords.includes(token)) {
      type = "builtin";
    } else if (pythonKeyWords.skyWords.includes(token)) {
      type = "boolean";
    } else if (pythonKeyWords.redWords.includes(token)) {
      type = "exception";
    }

    return { token, type };
  });
}
