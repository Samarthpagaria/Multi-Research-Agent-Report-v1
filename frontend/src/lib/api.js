export async function fetchResearchReport(topic) {
  const response = await fetch("http://localhost:8000/api/research/ai-research", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ topic }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || "Failed to generate research report");
  }

  const json = await response.json();
  if (json.status === "success" && json.data) {
    return {
      report: json.data.report || "",
      feedback: json.data.feedback || undefined,
    };
  }
  throw new Error("Invalid API response structure");
}
