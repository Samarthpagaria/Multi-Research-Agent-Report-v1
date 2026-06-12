import { createContext, useContext, useState, useCallback } from "react";
import { fetchResearchReport } from "../lib/api.js";

const ResearchContext = createContext();

export function ResearchProvider({ children }) {
  const [appState, setAppState] = useState("idle");
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);

  const handleQuerySubmit = useCallback(async (message) => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setAppState("chat");
    setIsThinking(true);

    try {
      const res = await fetchResearchReport(message);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.report, feedback: res.feedback }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `**Error:** ${err.message || "Failed to generate research report."}`
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  }, []);

  return (
    <ResearchContext.Provider
      value={{
        appState,
        setAppState,
        messages,
        setMessages,
        isThinking,
        handleQuerySubmit
      }}
    >
      {children}
    </ResearchContext.Provider>
  );
}

export function useResearch() {
  const context = useContext(ResearchContext);
  if (!context) {
    throw new Error("useResearch must be used within a ResearchProvider");
  }
  return context;
}
