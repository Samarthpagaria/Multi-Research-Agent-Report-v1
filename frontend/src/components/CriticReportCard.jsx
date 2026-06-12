import { useMemo } from "react";

export function CriticReportCard({ feedback }) {
  const parsedFeedback = useMemo(() => {
    if (!feedback) return null;

    const scoreMatch = feedback.match(/(?:score|rating)\s*:\s*\*?\*?(\d+(?:\.\d+)?)\*?\*?\s*\/\s*10/i) || 
                       feedback.match(/(\d+(?:\.\d+)?)\s*\/\s*10/) ||
                       feedback.match(/(?:score|rating)\s*:\s*\*?\*?(\d+(?:\.\d+)?)/i);
    const score = scoreMatch ? scoreMatch[1] : null;

    const lines = feedback.split("\n");
    const strengths = [];
    const improvements = [];
    let verdict = "";
    let currentSection = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      const lower = trimmed.toLowerCase();
      
      if (lower.includes("strengths:")) {
        currentSection = "strengths";
        continue;
      }
      if (lower.includes("improvement:") || lower.includes("improvements:")) {
        currentSection = "improvements";
        continue;
      }
      if (lower.includes("verdict:")) {
        currentSection = "verdict";
        continue;
      }

      if (currentSection === "strengths" && (trimmed.startsWith("- ") || trimmed.startsWith("* "))) {
        strengths.push(trimmed.substring(2));
      } else if (currentSection === "improvements" && (trimmed.startsWith("- ") || trimmed.startsWith("* "))) {
        improvements.push(trimmed.substring(2));
      } else if (currentSection === "verdict") {
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          verdict = trimmed.substring(2);
        } else if (trimmed && !trimmed.toLowerCase().startsWith("score:")) {
          verdict = trimmed;
        }
      }
    }

    return { score, strengths, improvements, verdict };
  }, [feedback]);

  if (!parsedFeedback) return null;

  return (
    <div className="border border-zinc-800/80 rounded-2xl bg-[#18181b]/20 p-5 mb-6 text-left relative overflow-hidden backdrop-blur-sm">
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-850 pb-4 mb-4">
        <div>
          <h4 className="text-sm font-semibold text-[#fafafa] tracking-wide uppercase select-none">AI Critic Report Card</h4>
          {parsedFeedback.verdict && (
            <p className="text-xs text-[#a1a1aa] mt-1 italic">"{parsedFeedback.verdict}"</p>
          )}
        </div>
        {parsedFeedback.score && (
          <div className="flex items-center gap-3 bg-red-950/45 border border-red-800/40 rounded-xl px-4 py-2 select-none self-start sm:self-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-medium text-red-400">Score</span>
            <span className="text-lg font-bold text-red-400">{parsedFeedback.score}<span className="text-xs text-red-500/80 font-normal">/10</span></span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {parsedFeedback.strengths.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 select-none">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Strengths
            </h5>
            <ul className="list-disc pl-4 space-y-1.5 text-xs text-[#a1a1aa]">
              {parsedFeedback.strengths.map((item, idx) => (
                <li key={idx}>{parseInline(item)}</li>
              ))}
            </ul>
          </div>
        )}

        {parsedFeedback.improvements.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-xs font-semibold text-amber-400 flex items-center gap-1.5 select-none">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Areas to Improve
            </h5>
            <ul className="list-disc pl-4 space-y-1.5 text-xs text-[#a1a1aa]">
              {parsedFeedback.improvements.map((item, idx) => (
                <li key={idx}>{parseInline(item)}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
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
