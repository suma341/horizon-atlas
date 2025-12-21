import { HighlightType } from "./highlight";

export type LanguageRules = {
  commentSymbols: string[]; // 例: ["#", "//"]
  keywords: {
    keyword: string[];
    builtin: string[];
    boolean: string[];
    exception: string[];
  };
  specialRules?: (token: string, context: any) => HighlightType | null;
};