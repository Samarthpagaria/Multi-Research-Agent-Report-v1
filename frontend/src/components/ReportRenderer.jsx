import { useMemo } from "react";

export function ReportRenderer({ content }) {
  const blocks = useMemo(() => {
    const rawLines = content.split("\n");
    const lines = [];

    for (let i = 0; i < rawLines.length; i++) {
      const line = rawLines[i];
      const trimmed = line.trim();

      if (trimmed === "") {
        let prevIsTable = false;
        for (let j = i - 1; j >= 0; j--) {
          if (rawLines[j].trim() !== "") {
            prevIsTable = rawLines[j].trim().startsWith("|");
            break;
          }
        }
        let nextIsTable = false;
        for (let j = i + 1; j < rawLines.length; j++) {
          if (rawLines[j].trim() !== "") {
            nextIsTable = rawLines[j].trim().startsWith("|");
            break;
          }
        }
        if (prevIsTable && nextIsTable) {
          continue;
        }
      }
      lines.push(line);
    }

    const parsedBlocks = [];
    let currentTable = [];
    let currentList = null;

    const pushTable = () => {
      if (currentTable.length > 0) {
        parsedBlocks.push({ type: "table", data: currentTable });
        currentTable = [];
      }
    };

    const pushList = () => {
      if (currentList) {
        parsedBlocks.push(currentList);
        currentList = null;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (trimmed.startsWith("|")) {
        pushList();
        const cells = line.split("|").map((c) => c.trim()).slice(1, -1);
        const isSeparator = cells.every((c) => c.match(/^[-:]+$/));
        if (!isSeparator && cells.length > 0) {
          currentTable.push(cells);
        }
      } else {
        pushTable();

        const isUnordered = trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("+ ") || trimmed.startsWith("• ");
        const isOrdered = /^\d+\.\s+/.test(trimmed);

        if (isUnordered) {
          const itemText = trimmed.substring(2);
          if (currentList && currentList.type === "ul") {
            currentList.items.push(itemText);
          } else {
            pushList();
            currentList = { type: "ul", items: [itemText] };
          }
        } else if (isOrdered) {
          const itemText = trimmed.replace(/^\d+\.\s+/, "");
          if (currentList && currentList.type === "ol") {
            currentList.items.push(itemText);
          } else {
            pushList();
            currentList = { type: "ol", items: [itemText] };
          }
        } else {
          pushList();
          parsedBlocks.push({ type: "line", text: line });
        }
      }
    }

    pushTable();
    pushList();

    return parsedBlocks;
  }, [content]);

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        if (block.type === "table") {
          return (
            <div key={index} className="overflow-x-auto my-4 border border-zinc-800/60 rounded-xl no-scrollbar">
              <table className="min-w-full divide-y divide-zinc-800 bg-[#18181b]/40 text-xs text-left">
                <thead>
                  <tr className="bg-zinc-900/50">
                    {block.data[0].map((cell, idx) => (
                      <th key={idx} className="px-4 py-2.5 font-semibold text-[#fafafa] border-r border-zinc-800/40 last:border-0">{parseInline(cell)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {block.data.slice(1).map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-zinc-900/10">
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="px-4 py-2.5 text-[#a1a1aa] border-r border-zinc-800/40 last:border-0">{parseInline(cell)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === "ul") {
          return (
            <ul key={index} className="list-disc ml-5 space-y-1.5 my-3 text-sm text-[#a1a1aa]">
              {block.items.map((item, idx) => (
                <li key={idx}>{parseInline(item)}</li>
              ))}
            </ul>
          );
        }

        if (block.type === "ol") {
          return (
            <ol key={index} className="list-decimal ml-5 space-y-1.5 my-3 text-sm text-[#a1a1aa]">
              {block.items.map((item, idx) => (
                <li key={idx}>{parseInline(item)}</li>
              ))}
            </ol>
          );
        }

        const trimmed = block.text.trim();
        
        const h1Match = trimmed.match(/^#\s+(.*)/);
        if (h1Match) {
          return <h1 key={index} className="text-xl font-bold border-b border-zinc-800 pb-2 text-[#fafafa] mt-6 mb-3">{parseInline(h1Match[1])}</h1>;
        }
        const h2Match = trimmed.match(/^##\s+(.*)/);
        if (h2Match) {
          return <h2 key={index} className="text-lg font-semibold border-l-2 border-red-600 pl-2 text-[#fafafa] mt-5 mb-2.5">{parseInline(h2Match[1])}</h2>;
        }
        const h3Match = trimmed.match(/^###\s+(.*)/);
        if (h3Match) {
          return <h3 key={index} className="text-base font-bold text-[#fafafa] mt-4 mb-2">{parseInline(h3Match[1])}</h3>;
        }
        const h4Match = trimmed.match(/^####\s+(.*)/);
        if (h4Match) {
          return <h4 key={index} className="text-sm font-bold text-[#fafafa] mt-3 mb-1.5">{parseInline(h4Match[1])}</h4>;
        }
        if (trimmed === "---") {
          return <hr key={index} className="border-t border-zinc-800/60 my-6" />;
        }
        if (!trimmed) return <div key={index} className="h-1" />;
        return <p key={index} className="text-sm md:text-base leading-relaxed text-[#a1a1aa]">{parseInline(trimmed)}</p>;
      })}
    </div>
  );
}

function parseInline(text) {
  return text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|\[\d+\])/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index} className="font-bold text-[#fafafa]">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={index} className="italic text-[#fafafa]/90">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={index} className="px-1.5 py-0.5 font-mono text-xs bg-zinc-900 border border-zinc-800 rounded text-red-400">{part.slice(1, -1)}</code>;
    }
    if (part.match(/^\[\d+\]$/)) {
      return (
        <span key={index} className="px-1.5 py-0.5 mx-0.5 text-[10px] font-mono font-bold bg-red-950/40 text-red-400 border border-red-800/40 rounded">
          {part}
        </span>
      );
    }
    return part;
  });
}
