import { MdTypeAndText } from "@/types/parent";

// type TypeAndIndex = {
//   startIndex: number;
//   endIndex: number;
//   type:string;
// };

type Patterns = {
  type:string;
  regex: RegExp;
}

export function searchMDKeyword(text: string): MdTypeAndText[] {
  if (!text) return [];

  const result: MdTypeAndText[] = [];
  let currentIndex = 0;

  const patterns: Patterns[] = [
    { type: "link", regex: /\[([^\]]+)\]\(([^\)]+)\)/ },
    { type: "bold", regex: /\*\*(.+?)\*\*/ },
    { type: "italic", regex: /_(.+?)_/ },
    { type: "code", regex: /`([^`]+)`/ },
    { type: "underline", regex: /<u>(.+?)<\/u>/ },
  ];

  while (currentIndex < text.length) {
    let closestMatch: RegExpExecArray | null = null;
    let closestPattern: Patterns | null = null;

    for (const { type, regex } of patterns) {
      const match = regex.exec(text.slice(currentIndex));
      if (match && (!closestMatch || match.index < closestMatch.index)) {
        closestMatch = match;
        closestPattern = { type, regex };
      }
    }

    if (!closestMatch) {
      result.push({
        type: "plain",
        text: text.slice(currentIndex),
        style: undefined,
        link: undefined,
      });
      break;
    }

    // プレーンテキスト追加
    if (closestMatch.index > 0) {
      result.push({
        type: "plain",
        text: text.slice(currentIndex, currentIndex + closestMatch.index),
        style: undefined,
        link: undefined,
      });
    }

    const matchedText = closestMatch[0];
    const innerText = closestMatch[1];

    let style: React.CSSProperties | undefined;
    let link: string | undefined;

    if (closestPattern?.type === "link") {
      link = closestMatch[2];
      const innerDecorations = searchMDKeyword(innerText);
      if (innerDecorations.length > 0) {
        innerDecorations.forEach((deco) =>
          result.push({ ...deco, link, type: combineTypes(deco.type, "link") })
        );
      } else {
        result.push({
          type: "link",
          text: innerText,
          style: {
            color: "rgb(115, 115, 115)",
            textDecorationLine: "underline",
            cursor: "pointer",
          },
          link,
        });
      }
    } else {
      switch (closestPattern?.type) {
        case "bold":
          style = { fontWeight: 700 };
          break;
        case "italic":
          style = { fontStyle: "italic" };
          break;
        case "code":
          style = {
            backgroundColor: "rgb(235, 235, 235)",
            color: "rgb(244,63,94)",
            paddingLeft: 4,
            paddingRight: 4,
            borderRadius: 4,
          };
          break;
        case "underline":
          style = { textDecorationLine: "underline" };
          break;
      }
      result.push({ type: closestPattern?.type || "plain", text: innerText, style, link });
    }

    currentIndex += closestMatch.index + matchedText.length;
  }

  return result;
}


// 装飾範囲をマージ
// function mergeOverlappingRanges(types: TypeAndIndex[]): TypeAndIndex[] {
//   if (types.length === 0) {
//     return [];
//   }

//   // 開始位置でソート
//   const sorted = types.sort((a, b) => a.startIndex - b.startIndex);

//   const result: TypeAndIndex[] = [];
//   let current = sorted[0];

//   for (let i = 1; i < sorted.length; i++) {
//     const next = sorted[i];
//     if (current.endIndex > next.startIndex) {
//       // 重複範囲をマージ
//       current = {
//         startIndex: current.startIndex,
//         endIndex: Math.max(current.endIndex, next.endIndex),
//         type: combineTypes(current.type, next.type),
//       };
//     } else {
//       result.push(current);
//       current = next;
//     }
//   }
//   result.push(current);
//   return result;
// }

// タイプを組み合わせる
function combineTypes(type1: string, type2: string): string {
  const types = new Set(type1.split(" ").concat(type2.split(" ")));
  return Array.from(types).join(" ");
}

