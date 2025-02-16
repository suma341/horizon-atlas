import { MdTypeAndText } from "@/types/parent";
import { searchPageById } from "./searchPageById";

type TypeAndIndex = {
  startIndex: number;
  endIndex: number;
  type:string;
};

type Patterns = {
  type:string;
  regex: RegExp;
}

export async function searchMDKeyword(text: string) {
  if (!text) {
    return [];
  }

  const types: TypeAndIndex[] = [];
  const patterns: Patterns[] = [
    { type: "link", regex: /\[([^\]]+)\]\(([^\)]+)\)/g }, // リンクを最優先
    { type: "bold", regex: /\*\*(.*?)\*\*/g },
    { type: "italic", regex: /_(.*?)_/g },
    { type: "code", regex: /`(.*?)`/g },
    { type: "underline", regex: /<u>(.*?)<\/u>/g },
  ];

  // 各パターンに対してマッチを検索
  for (const { type, regex } of patterns) {
    let match;
    while ((match = regex.exec(text)) !== null) {
      types.push({
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        type,
      });
    }
  }

  // 重複部分をマージ
  const mergedTypes = mergeOverlappingRanges(types);

  const result: MdTypeAndText[] = [];
  let lastIndex = 0;

  for (const range of mergedTypes) {
    // 非装飾部分を追加
    if (lastIndex < range.startIndex) {
      result.push({
        type: "plain",
        text: text.slice(lastIndex, range.startIndex),
        style: undefined,
        link: undefined,
      });
    }

    // 装飾部分を追加
    let content = text.slice(range.startIndex, range.endIndex);
    let style: React.CSSProperties | undefined;
    let link: string | undefined;

    if (range.type.includes("link")) {
      const match = content.match(/\[([^\]]+)\]\(([^\)]+)\)/);
      if (match) {
        const innerText = match[1];
        link = match[2];
        if(typeof link ==="string"){
          if(link.slice(0,8)==='https://' || link.slice(0,7)==='http://'){
            link=link;
          }else{
            const page = await searchPageById(link.slice(1));
            if(page.pageId===""){
              link = "";
            }else{
              link = page.isChildPage ? `/posts/post/${page.slug}/${page.pageId}` : `/posts/post/${page.slug}`
            }
          }
        }

        // リンク内部を再解析
        const innerDecorations = await searchMDKeyword(innerText);

        if (innerDecorations.length > 0) {
          // リンク内部の装飾を組み合わせて追加
          innerDecorations.forEach(deco => {
            result.push({
              ...deco,
              type: combineTypes(deco.type, "link"),
              link,
            });
          });
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
        lastIndex = range.endIndex;
        continue;
      }
    }

    if (range.type.includes("bold")) {
      content = content.slice(2, -2);
      style = { fontWeight: 700 };
    }
    if (range.type.includes("italic")) {
      content = content.slice(1, -1);
      style = { ...style, fontStyle: "italic" };
    }
    if (range.type.includes("code")) {
      content = content.slice(1, -1);
      style = {
        ...style,
        backgroundColor: "rgb(235 235 235)",
        color: "rgb(244,63,94)",
        paddingLeft: 4,
        paddingRight: 4,
        borderRadius: 4,
      };
    }
    if (range.type.includes("underline")) {
      content = content.slice(3, -4);
      style = { ...style, textDecorationLine: "underline" };
    }

    result.push({ type: range.type, text: content, style, link });
    lastIndex = range.endIndex;
  }

  // 最後の非装飾部分を追加
  if (lastIndex < text.length) {
    result.push({
      type: "plain",
      text: text.slice(lastIndex),
      style: undefined,
      link: undefined,
    });
  }

  return result;
}

// 装飾範囲をマージ
function mergeOverlappingRanges(types: TypeAndIndex[]): TypeAndIndex[] {
  if (types.length === 0) {
    return [];
  }

  // 開始位置でソート
  const sorted = types.sort((a, b) => a.startIndex - b.startIndex);

  const result: TypeAndIndex[] = [];
  let current = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    const next = sorted[i];
    if (current.endIndex > next.startIndex) {
      // 重複範囲をマージ
      current = {
        startIndex: current.startIndex,
        endIndex: Math.max(current.endIndex, next.endIndex),
        type: combineTypes(current.type, next.type),
      };
    } else {
      result.push(current);
      current = next;
    }
  }
  result.push(current);
  return result;
}

// タイプを組み合わせる
function combineTypes(type1: string, type2: string): string {
  const types = new Set(type1.split(" ").concat(type2.split(" ")));
  return Array.from(types).join(" ");
}

