import { HighlightType } from "@/types/highlight";
import { pythonKeyWords } from "./keywords";

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
  // 数字（負の数・小数）もまとめて1トークンにする
  const tokens = line.split(/(\s+|["'()=:,\[\]])/).filter(t => t !== "");
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
      if (/^[A-Za-z_]\w*$/.test(token)) {
        type = highlightNextName === "def" ? "functionName" : "className";
        highlightNextName = "";
      }
    }
    // 数字（負の数や小数も対応）
    else if (/^-?\d+(\.\d+)?$/.test(token)) {
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
