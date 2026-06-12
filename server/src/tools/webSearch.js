import { tool } from "@langchain/core/tools";
import * as z from "zod";
import { TavilySearch } from "@langchain/tavily";
import dotenv from "dotenv";
dotenv.config();

const tavilySearch = new TavilySearch({
  apiKey: process.env.TAVILY_API_KEY,
  searchDepth: "advanced",
  maxResults: 6,
});

export const webSearch = tool(
  async ({ query }) => {
    const data = await tavilySearch.invoke({ query });
    const results = data?.results;
    const filteredResult = results.map((result) => {
      return {
        title: result.title,
        url: result.url,
        snippet: result.content.slice(0, 301),
      };
    });
    return JSON.stringify(filteredResult);
  },
  {
    name: "web_search",
    description:
      "Search the web for reliable information on topic.Return Titles,URLs and snippets.",
    schema: z.object({
      query: z.string().describe("The search query to find information."),
    }),
  },
);
