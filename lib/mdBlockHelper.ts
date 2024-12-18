import { MdTypeAndText } from "@/types/mdTypeAndText";

type TypeAndIndex = {
  startIndex: number;
  endIndex: number;
  type: "bold" | "italic" | "code" | "underline" | "link" | "normal";
};

type Patterns = {
  type:"bold" | "italic" | "code" | "underline" | "link" | "normal";
  regex: RegExp;
}

export function searchMDKeyword(text: string): MdTypeAndText[] {
  const types: TypeAndIndex[] = [];

  // パターンの正規表現を準備
  const patterns:Patterns[] = [
    { type: "bold", regex: /\*\*(.*?)\*\*/g },
    { type: "italic", regex: /_(.*?)_/g },
    { type: "code", regex: /`(.*?)`/g },
    { type: "underline", regex: /<u>(.*?)<\/u>/g },
    { type: "link", regex: /\[([^\]]+)\]\(([^\)]+)\)/ },
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
  let indexList:number[] = [];
  for(let j=0;j<text.length;j++){
    indexList.push(j)
  } 
  for(let i=0;i<types.length;i++){
    for(let j=types[i].startIndex;j<types[i].endIndex;j++){
      indexList = indexList.filter((item)=>item !== j);
    }
  }
  const diveded = divideConsecutive(indexList);
  for(let i=0;i<diveded.length;i++){
    types.push({
      startIndex:diveded[i][0],
      endIndex:diveded[i][0] + diveded[i].length,
      type:"normal"
    })
  }

  const sortedText:TypeAndIndex[] = sortText(types);

  const mdArray:string[] = [];
  for(let i=0;i<sortedText.length;i++){
    mdArray.push(text.slice(sortedText[i].startIndex, sortedText[i].endIndex));
  }

  const dividedText:MdTypeAndText[] = [];
  for(let i=0;i<sortedText.length;i++){
    let link:string = "";
    if(sortedText[i].type==='bold'){
      mdArray[i] = mdArray[i].slice(2, -2);
    }else if(sortedText[i].type === 'code' || sortedText[i].type=== 'italic'){
      mdArray[i] = mdArray[i].slice(1,-1);
    }else if(sortedText[i].type === 'underline'){
      mdArray[i] = mdArray[i].slice(3, -4);
    }else if(sortedText[i].type === 'link'){
      const match = mdArray[i].match(/\[([^\]]+)\]\(([^\)]+)\)/);
      if(match){
        mdArray[i] = match[1];
        link = match[2];
      }
    };
    dividedText.push({
      type: sortedText[i].type,
      text: mdArray[i],
      link: link != "" ? link : undefined
    });
  }

  return dividedText;
}

function divideConsecutive(arr:number[]) {
  const result = [];
  let temp = [arr[0]];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] === arr[i - 1] + 1) {
      temp.push(arr[i]);
    } else {
      result.push(temp);
      temp = [arr[i]];
    }
  }

  result.push(temp); // Push the last group
  return result;
}

function sortText(types: TypeAndIndex[]){
  const sortedText:TypeAndIndex[] = types.sort((a, b) => a.startIndex - b.startIndex);
  return sortedText;
}
