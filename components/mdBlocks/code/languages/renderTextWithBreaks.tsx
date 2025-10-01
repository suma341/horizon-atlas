export function RenderTextWithBreaks(
  text: string,
  style: React.CSSProperties,
  onClick?: () => void
) {
    const t = text.replace(/\t/g, '  ')
    return (
      <span
        style={{
          ...style,
          fontFamily:"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
          whiteSpace: "pre-wrap",
        }}
        onClick={onClick}
      >
        {t}
      </span>
    );
};