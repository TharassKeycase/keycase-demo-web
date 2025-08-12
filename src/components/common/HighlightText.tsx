interface HighlightTextProps {
  text: string;
  highlight: string;
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

const HighlightText: React.FC<HighlightTextProps> = ({ text, highlight }) => {
  const escapedHighlight = escapeRegExp(highlight);
  const parts = text.split(new RegExp(`(${escapedHighlight})`, "gi"));
  
  return (
    <span>
      {parts.map((part, i) => (
        <span
          key={i}
          style={
            part.toLowerCase() === highlight.toLowerCase()
              ? { fontWeight: "bold", backgroundColor: "yellow" }
              : {}
          }
        >
          {part}
        </span>
      ))}
    </span>
  );
};

export default HighlightText;