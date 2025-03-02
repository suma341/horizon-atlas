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