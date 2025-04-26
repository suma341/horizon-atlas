import { Parent } from "@/types/Parent";
import { MdTypeAndText } from "@/types/textAndType";


export function assignCssProperties(mdTypeAndText:MdTypeAndText){
  const result:React.CSSProperties[] = [];
  for(const type of mdTypeAndText.type){
    switch (type) {
      case "bold":
        result.push({ fontWeight: 700 });
      case "italic":
        result.push({ fontStyle: "italic" });
        break;
      case "code":
        result.push({
          backgroundColor: "rgb(235, 235, 235)",
          color: "rgb(244,63,94)",
          paddingLeft: 4,
          paddingRight: 4,
          borderRadius: 4,
        });
        break;
      case "underline":
        result.push({ textDecorationLine: "underline" });
        break;
    }
  }
  const properties:React.CSSProperties = Object.assign({},...result);
  return properties;
}

export function assignCss(parent:Parent){
  const result:React.CSSProperties[] = [];
  const attritube = parent.annotations
  const color = assignColor(attritube.color)
  if(color!==""){
    result.push({color})
  }
  if(attritube.bold){
    result.push({ fontWeight: 700 });
  }
  if(attritube.italic){
    result.push({ fontStyle: "italic" })
  }
  if(attritube.code){
    result.push({
      backgroundColor: "rgb(235, 235, 235)",
      color: color==="" ? "rgb(244,63,94)" : color,
      paddingLeft: 4,
      paddingRight: 4,
      borderRadius: 4,
    });
  }
  if(attritube.underline){
    result.push({ textDecorationLine: "underline" });
  }
  if(parent.href){
    result.push(attritube.underline ? {} : {textDecorationLine: "underline"})
    result.push((color!=="" || attritube.code) ? {} : {color:"rgb(115 115 115)"})
    if(parent.href!==""){
      result.push({cursor:"pointer"})
    }
  }
  
  const properties:React.CSSProperties = Object.assign({},...result);
  return properties;
}

function assignColor(color:string){
  switch(color){
    case "default":
      return "";
    case "gray":
      return "rgba(120, 119, 116, 1)";
    case "brown":
      return "rgba(159, 107, 83, 1)";
    case "orange":
      return "rgba(217, 115, 13, 1)";
    case "yellow":
      return "rgba(203, 145, 47, 1)";
    case "green":
      return "rgba(68, 131, 97, 1)";
    case "blue":
      return "rgba(51, 126, 169, 1)";
    case "purple":
      return "rgba(144, 101, 176, 1)";
    case "pink":
      return "rgba(193, 76, 138, 1)";
    case "red":
      return "rgba(212, 76, 71, 1)";
  }
  return ""
}