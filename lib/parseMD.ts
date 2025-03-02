type MdTypeAndText = {
    text: string;
    type: string[];
    link: string[];
  };
  
  const patterns = [
    { type: "link", regex: /\[([^\]]+)\]\(([^\)]+)\)/g },
    { regex: /\*\*(.*?)\*\*/g, type: "bold", remove: /\*\*/g }, 
    { regex: /`([^`]+)`/g, type: "code", remove: /`/g }, 
    { regex: /__(.*?)__/g, type: "italic", remove: /__/g }, 
    { type: "underline", regex: /<u>(.*?)<\/u>/g,remove: /<\/?u>/g },
  ];
  
export function parseMarkdown(node: MdTypeAndText): MdTypeAndText[] {
    const result: MdTypeAndText[] = [];
    let lastIndex = 0;
    let matched = false;
  
    for (const { regex, type, remove } of patterns) {
      regex.lastIndex = 0;
      let match: RegExpExecArray | null;
      matched = false;
  
      while ((match = regex.exec(node.text)) !== null) {
        matched = true;
  
        if (lastIndex < match.index) {
          result.push({
            text: node.text.slice(lastIndex, match.index),
            type: [...node.type, "plain"],
            link:[...node.link]
          });
        }
  
        const cleanText = match[1];
  
        const newNode: MdTypeAndText = {
          text: type==="link" ? cleanText : cleanText.replace(remove!,""),
          type: [...node.type, type],
          link: type === "link" ? [...node.link,match[2]] : [...node.link]
        };

        result.push(newNode);
        lastIndex = regex.lastIndex;
      }
  
      if (matched) {
        break;
      }
    }
  
    if (!matched) {
      result.push({ text: node.text, type: [...node.type, "plain"],link:[...node.link] });
      return result;
    }
  
    if (lastIndex < node.text.length) {
      result.push({
        text: node.text.slice(lastIndex),
        type: [...node.type, "plain"],
        link:[...node.link]
      });
    }
  
    return result.flatMap((n) => parseMarkdown(n));
  }
  
  