import { run_research_pipeline } from "../pipeline.js";

const INJECTION_BLOCKLIST = [
  "ignore previous instructions",
  "ignore all instructions",
  "system prompt",
  "reveal your system",
  "reveal api keys",
  "api_key",
  "huggingface_api_key",
  "tavily_api_key",
  "you are now a",
  "developer mode",
];

const ai_response_controller = async (req, res) => {
  const { topic } = req.body;
  if (!topic || topic.trim() === "") {
    return res.status(400).json({ error: "Topic is required" });
  }

  // API Abuse Protection: limit prompt/topic length to prevent token abuse and large bills
  if (topic.length > 5000) {
    return res.status(400).json({
      error: "Topic is too long",
      message: "Prompt exceeds the limit of 5000 characters.",
    });
  }
  // 2. Guardrails: Prompt Injection Check
  const normalizedTopic = topic.toLowerCase();
  const containsInjection = INJECTION_BLOCKLIST.some((phrase) =>
    normalizedTopic.includes(phrase),
  );
  if (containsInjection) {
    return res.status(400).json({
      error: "Invalid input",
      message:
        "Security threat detected: Your request contains blocked instructions.",
    });
  }
  try {
    const result = await run_research_pipeline(topic);
    console.log("\nPipeline finished. Result state:", result);
    res.json({
      status: "success",
      message: "AI Research pipeline completed successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in AI Research Pipeline:", error);
    return res.status(500).json({
      error: "Failed to generate AI research",
      details: error.message,
    });
  }
};

export { ai_response_controller };
