export function RenderTextWithBreaks(
  text: string,
  style: React.CSSProperties,
  onClick?: () => void
) {
  const t = text.replace(/\t/g, "  ");
  return (
    <span
      style={{
        ...style,
        fontFamily:
          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
        whiteSpace: "pre", // ← pre-wrap ではなく pre にする
      }}
      onClick={onClick}
    >
      {t}
    </span>
  );
}


//{\"language\":\"plain text\",\"caption\":[],\"parent\":[{\"annotations\":{\"bold\":false,\"italic\":false,\"strikethrough\":false,\"underline\":false,\"code\":false,\"color\":\"default\"},\"plain_text\":\"文字列を入力してください: HelloHorizon\\n何文字目から抜き出しますか？:\",\"href\":null},{\"annotations\":{\"bold\":false,\"italic\":false,\"strikethrough\":false,\"underline\":false,\"code\":false,\"color\":\"green\"},\"plain_text\":\"2\",\"href\":null},{\"annotations\":{\"bold\":false,\"italic\":false,\"strikethrough\":false,\"underline\":false,\"code\":false,\"color\":\"default\"},\"plain_text\":\"\\n何文字目まで抜き出しますか？:\",\"href\":null},{\"annotations\":{\"bold\":false,\"italic\":false,\"strikethrough\":false,\"underline\":false,\"code\":false,\"color\":\"green\"},\"plain_text\":\"7\",\"href\":null},{\"annotations\":{\"bold\":false,\"italic\":false,\"strikethrough\":false,\"underline\":false,\"code\":false,\"color\":\"default\"},\"plain_text\":\"\\n文字列を2文字目から7文字目まで抜き出すと「elloHo」です。\",\"href\":null}]}",