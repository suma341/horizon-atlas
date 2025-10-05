import { HighlightType } from "@/types/highlight";
import { LanguageRules } from "@/types/languageRule";

export function highlightCode(
  text: string,
  rules: LanguageRules
): { token: string; type: HighlightType }[] {
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

    // コメント判定（複数シンボル対応）
    const commentIndex = rules.commentSymbols
      .map((sym) => line.indexOf(sym))
      .filter((i) => i !== -1)
      .sort((a, b) => a - b)[0] ?? -1;

    if (commentIndex !== -1) {
      const codePart = line.slice(0, commentIndex);
      const commentPart = line.slice(commentIndex);

      if (codePart) results.push(...highlightLine(codePart, rules));
      results.push({ token: commentPart, type: "comment" });
    } else {
      results.push(...highlightLine(line, rules));
    }

    if (newlineIndex !== -1) {
      results.push({ token: "\n", type: "none" });
    }
  }

  return results;
}

function highlightLine(
  line: string,
  rules: LanguageRules
): { token: string; type: HighlightType }[] {
  const tokens = line.split(/(\s+|["'()=:,\[\]])/).filter((t) => t !== "");
  let inString: string | null = null;

  return tokens.map((token) => {
    let type: HighlightType = "none";

    // 文字列
    if (!inString && /^["']$/.test(token)) {
      inString = token;
      type = "string";
    } else if (inString) {
      if (token === inString) {
        inString = null;
      }
      type = "string";
    }
    // 数字
    else if (/^-?\d+(\.\d+)?$/.test(token)) {
      type = "number";
    }
    // キーワード判定
    else if (rules.keywords.keyword.includes(token)) {
      type = "keyword";
    } else if (rules.keywords.builtin.includes(token)) {
      type = "builtin";
    } else if (rules.keywords.boolean.includes(token)) {
      type = "boolean";
    } else if (rules.keywords.exception.includes(token)) {
      type = "exception";
    }
    // 特殊ルール（関数名やクラス名など）
    else if (rules.specialRules) {
      const special = rules.specialRules(token, { line, tokens });
      if (special) type = special;
    }

    return { token, type };
  });
}
