export function renderTextWithBreaks(text: string, style: React.CSSProperties, onClick?: () => void) {
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    const matches = [...text.matchAll(/\n/g)];
  
    matches.forEach((match, i) => {
      const index = match.index!;
      elements.push(
        <span key={`line-${i}`} style={style} onClick={onClick}>
          {text.slice(lastIndex, index)}
        </span>
      );
      elements.push(<br key={`br-${i}`} />);
      lastIndex = index + 1;
    });
  
    // 残りのテキストを追加
    if (lastIndex < text.length) {
      elements.push(
        <span key={`line-final`} style={style} onClick={onClick}>
          {text.slice(lastIndex)}
        </span>
      );
    }
  
    return elements;
  }