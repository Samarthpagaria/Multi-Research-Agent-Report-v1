import { tool } from "@langchain/core/tools";
import * as z from "zod";
import * as cheerio from "cheerio";
export const scrape_webUrl = tool(
  async ({ url }) => {
    try {
      // 1. Fetch the website content with a timeout and User-Agent header
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second timeout
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      $("script, style, nav, footer, header").remove();

      // 4. Extract text content, strip white spaces, and slice to 3000 characters
      const cleanText = $("body")
        .text()
        .replace(/\s+/g, " ") // Collapses multiple spaces/newlines into a single space
        .trim();

      return cleanText;
    } catch (error) {
      return `Could not scrape URL: ${error.message}`;
    }
  },
  {
    name: "scrape_webUrl",
    description:
      "Scrape and return clean content from a given URL for deeper reading.",
    schema: z.object({
      url: z
        .string()
        .url()
        .describe("The exact URL of the webpage to scrape text content from."),
    }),
  },
);
