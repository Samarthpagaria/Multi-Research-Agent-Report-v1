import { useEffect } from "react";
import { MorphPanel as AiInput } from "@/components/ai-research-input";
import { MessageLoading } from "@/components/ui/message-loading";
import { useAnimatedText } from "@/components/ui/animated-text";
import { CriticReportCard } from "@/components/CriticReportCard.jsx";
import { ReportRenderer } from "@/components/ReportRenderer.jsx";
import { useResearch } from "@/context/ResearchContext.jsx";

export default function App() {
  const { appState, setAppState, messages, setMessages, isThinking, handleQuerySubmit } = useResearch();

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const handleReset = () => {
    setMessages([]);
    setAppState("idle");
  };

  const latestReportMessage = [...messages].reverse().find((m) => m.role === "assistant");

  return (
    <div
      className="h-screen w-full flex flex-col bg-[#09090b] text-[#fafafa] overflow-hidden"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* 1. Loader View (when thinking) */}
      {isThinking ? (
        <div className="flex-grow flex flex-col items-center justify-center gap-6 w-full max-w-xl mx-auto px-4 text-center select-none">
          <MessageLoading />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-[#fafafa]">Analyzing & Synthesizing Report</h2>
            <p className="text-[#a1a1aa] text-sm leading-normal">
              Our multi-agent scouts are scraping resources, evaluating data points, and compiling findings. Please stand by...
            </p>
          </div>
        </div>
      ) : appState !== "chat" ? (
        /* 2. Starting landing page (when idle) */
        <div className="flex-grow flex flex-col items-center justify-center gap-6 w-full max-w-3xl mx-auto px-4 select-none">
          <div className={`flex flex-col items-center justify-center gap-3 text-center transition-all duration-500 ease-in-out ${
            appState === "idle" ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none h-0 overflow-hidden"
          }`}>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#fafafa]">Multi-Research Agent-Report</h1>
            <p className="text-[#a1a1aa] text-sm md:text-base">Deep-dive multi-agent research report generator</p>
          </div>

          <div className="w-full flex justify-center">
            <AiInput
              isOpen={appState === "input-open"}
              isPinned={false}
              onOpenChange={(open) => {
                setAppState(open ? "input-open" : "idle");
              }}
              onSubmit={handleQuerySubmit}
            />
          </div>
        </div>
      ) : (
        /* 3. Single-topic research report viewer */
        <div className="flex-grow flex flex-col h-full overflow-hidden">
          {/* Header (Full Width Outer, Centered Inner) */}
          <div className="w-full border-b border-zinc-850 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-10">
            <header className="flex items-center justify-between px-6 py-4 max-w-3xl mx-auto w-full">
              <div>
                <h2 className="text-md font-bold text-[#fafafa] tracking-tight">AI Agent Research System</h2>
                <p className="text-xs text-[#a1a1aa]">Single-topic synthesis report</p>
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-xs font-semibold text-[#fafafa] bg-red-950/30 hover:bg-red-950/50 border border-red-800/40 rounded-xl transition-all duration-300 cursor-pointer"
              >
                ← Start New Research
              </button>
            </header>
          </div>

          {/* Scroll Container (Spans overall width of the page) */}
          <div className="flex-1 overflow-y-auto w-full no-scrollbar">
            {/* Content Wrapper (Centered in the middle) */}
            <div className="max-w-3xl mx-auto px-6 py-6 w-full">
              <div className="flex flex-col gap-6 w-full pb-16">
                {latestReportMessage && (
                  <div className="w-full text-left leading-relaxed text-sm md:text-base">
                    <CriticReportCard feedback={latestReportMessage.feedback} />
                    <AnimatedText content={latestReportMessage.content} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AnimatedText({ content }) {
  const animatedText = useAnimatedText(content, " ");
  return <ReportRenderer content={animatedText} />;
}
