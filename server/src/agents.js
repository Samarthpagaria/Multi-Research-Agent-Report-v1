import { createAgent } from "langchain";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";
import { webSearch } from "./tools/webSearch.js";
import { scrape_webUrl } from "./tools/scape_web.js";

const outputParser = new StringOutputParser();

const model = new ChatOpenAI({
  model: process.env.MODEL,
  apiKey: process.env.OPENROUTER_API_KEY,
  temperature: 0.2,
  configuration: {
    baseURL: process.env.BASE_URL,
  },
});

// agents
export const build_search_agent = async () => {
  return createAgent({
    model,
    tools: [webSearch],
  });
};

export const build_reader_agent = async () => {
  return createAgent({
    model,
    tools: [scrape_webUrl],
  });
};

// chains
// writer chain
const writer_prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "you are an expert research writer. Write clear, structured and insightful reports.",
  ],
  [
    "human",
    ` Write a detailed research report on the topic below.
        Topic:{topic}

        Reaserch Gathered:
        {research}

        Structure the report as:
        - Introduction
        - Key findings (minimum 4 well explained points)
        - Conclusion
        - Sources (List all URLs found in the reasearch.)
        
        be detialed, factual and professional.
        `,
  ],
]);

export const writer_chain = writer_prompt.pipe(model).pipe(outputParser);

//critic chain
const critic_prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are sharp and constructive research critic. Be honest and specific.",
  ],
  [
    "human",
    ` Review the researcn report below and evaluate it strictly.
        
        Report:
        {report}

        Respond in this exact format:

        Score: X/10

        Strengths:
        - ...
        - ...

        Areas to Improvement:
        - ...
        - ...
        
        One line Verdict:
        - ...

        `,
  ],
]);

export const critic_chain = critic_prompt.pipe(model).pipe(outputParser);
