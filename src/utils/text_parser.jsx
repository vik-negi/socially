export function parseStyledText(text) {
  const rules = [
    { regex: /\*\*(.*?)\*\*/g, tag: "strong" }, // Bold: **text**
    { regex: /__(.*?)__/g, tag: "u" }, // Underline: __text__
    { regex: /\*(.*?)\*/g, tag: "em" }, // Italic: *text*
    { regex: /~(.*?)~/g, tag: "del" }, // Strikethrough: ~text~
  ];

  return text.split("\n").map((line, index) => {
    let parsedLine = line;
    rules.forEach((rule) => {
      parsedLine = parsedLine.replace(rule.regex, (match, p1) => {
        return `<${rule.tag}>${p1}</${rule.tag}>`;
      });
    });

    return <div key={index} dangerouslySetInnerHTML={{ __html: parsedLine }} />;
  });
}
