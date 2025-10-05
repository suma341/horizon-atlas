import { LanguageRules } from "@/types/languageRule";
import { pythonKeyWords } from "../python/keywords";
import { HighlightType } from "@/types/highlight";

export const pythonRules:LanguageRules = {
  commentSymbols: ["#"],
  keywords: {
    keyword: pythonKeyWords.purpleWords,
    builtin: pythonKeyWords.yellowWords,
    boolean: pythonKeyWords.skyWords,
    exception: pythonKeyWords.redWords,
  },
  specialRules: (token, ctx) => {
    // def/class の次は関数名/クラス名
    const i = ctx.tokens.indexOf(token);
    if (i > 0) {
      const prev = ctx.tokens[i - 1];
      if (prev === "def") return "functionName" as HighlightType;
      if (prev === "class") return "className" as HighlightType;
    }
    return null;
  },
};
