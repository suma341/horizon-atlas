"use client";

import { assignCss } from "@/lib/assignCssProperties";
import Prism, { Token } from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python"
import "prismjs/components/prism-bash"
import "prismjs/components/prism-java"
import "prismjs/components/prism-go"
import "prismjs/components/prism-c"
import "prismjs/components/prism-cpp"
import "prismjs/components/prism-csharp"
import "prismjs/components/prism-sql"
import "prismjs/components/prism-markup"
import "prismjs/components/prism-css"
import "prismjs/components/prism-kotlin"
import "prismjs/components/prism-swift"
import "prismjs/components/prism-json"
import "prismjs/components/prism-lua"
import "prismjs/components/prism-php"
import "prismjs/components/prism-docker"
import "prismjs/components/prism-powershell"
import { renderTextWithBreaks } from "../renderTextWithBreaks";
import React from "react";
import PlainTextCode from "./languages/plainText";
import { AtlRichTextEntity } from "@/types/pageData";

export default function CodeBlock({
  parents,
  language,
}: {
  parents: AtlRichTextEntity[];
  language: string;
}) {

    if(language=="plain text") return <PlainTextCode parent={parents} />
    const lan = safePrismLanguage(language)
  // ① Notion のテキストを結合
  const code = parents.map((p) => p.plain_text).join("");

  // ② Prism でトークン化
  try{
    const tokens = Prism.tokenize(code, Prism.languages[lan]);

  // ③ Notion の style を文字単位配列に変換（あなたの今の構造を利用）
  const notionStyles = parents.flatMap((p) => {
    const style = assignCss(p);
    return [...p.plain_text].map(() => style);
  });

  let index = 0; // どの文字に対して style を当てるか

  // ④ Prism token + Notion style + 改行を合成して DOM にする
  function renderToken(token:Prism.Token): React.ReactNode {
    if (typeof token === "string") {
      const styled = [...token].map((char) => {
        const style = notionStyles[index++] || {};
        return renderTextWithBreaks(char, style);
      });
      return <>{styled}</>;
    }

    // token はオブジェクト（keyword / string / operator etc）
    return (
      <span className={`token ${token.type}`} key={index}>
        {Array.isArray(token.content)
          ? token.content.map((t, i) => <React.Fragment key={i}>{renderToken(t as Token)}</React.Fragment>)
          : renderToken(token.content as Token)}
      </span>
    );
  }

  return (
    <pre className={`language-${lan}`} style={{marginTop:0,backgroundColor:"rgb(250,250,250)"}}>
      {tokens.map((token, i) => (
        <React.Fragment key={i}>{renderToken(token as Token)}</React.Fragment>
      ))}
    </pre>
  );
  }catch{
    console.log("未読み込み:",lan)
    return (
        <PlainTextCode parent={parents} />
    )
  }
}


function safePrismLanguage(lang: string) {
  const normalized = normalizeLanguage(lang);

  if (Prism.languages[normalized]) {
    return normalized;
  }

  console.warn(`Prism language "${normalized}" is not loaded. Falling back to "plain".`);
  return "plain";
}

// html → markup などの変換
function normalizeLanguage(lang: string): string {
  switch (lang) {
    case "html":
    case "xml":
    case "svg":
        return "markup";
    case "js":
        return "javascript";
    case "ts":
        return "typescript";
    case "c++":
        return "cpp"
    case "c#":
        return "csharp"
    case "zsh":
        return "bash"
    default:
      return lang.toLowerCase();
  }
}
