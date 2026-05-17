import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { generateNewsletterContent } from "../tools/newsletter.js";
import { analyzeNewsletterContent } from "../tools/analytics.js";
import fs from 'fs';
import path from 'path';
import { startScheduler } from "../scheduler/cron.js";


// Setup directories
const cwd = process.cwd();
['outputs', 'analytics', 'logs'].forEach(dir => {
    if (!fs.existsSync(path.join(cwd, dir))) {
        fs.mkdirSync(path.join(cwd, dir), { recursive: true });
    }
});

// Start the automated scheduler in the background
startScheduler();

const server = new Server(
  { name: "ai-newsletter-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "generate_newsletter",
        description: "Generates an AI-powered newsletter on a given topic.",
        inputSchema: {
          type: "object",
          properties: { topic: { type: "string" } },
          required: ["topic"]
        }
      },
      {
        name: "analyze_newsletter",
        description: "Performs NLP analytics on a newsletter.",
        inputSchema: {
          type: "object",
          properties: { content: { type: "string" } },
          required: ["content"]
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "generate_newsletter") {
    const content = await generateNewsletterContent(args.topic);
    
    const filename = `newsletter-${Date.now()}.md`;
    fs.writeFileSync(path.join(cwd, 'outputs', filename), content);

    return {
      content: [{ type: "text", text: `Newsletter generated and saved as ${filename}.\n\n${content}` }]
    };
  }

  if (name === "analyze_newsletter") {
    const analytics = analyzeNewsletterContent(args.content);
    
    const filename = `analytics-${Date.now()}.json`;
    fs.writeFileSync(path.join(cwd, 'analytics', filename), JSON.stringify(analytics, null, 2));

    const readableSummary = `
📊 Analytics Summary
--------------------
Total Words: ${analytics.totalWords}
Reading Time: ${analytics.readingTime}
Sentiment: ${analytics.sentiment} (Score: ${analytics.sentimentScore})
Top Keywords: ${analytics.topKeywords.join(', ')}
    `;

    return {
      content: [{ type: "text", text: `${readableSummary}\n\nFull JSON saved as ${filename}.` }]
    };
  }

  throw new Error(`Tool not found: ${name}`);
});

const transport = new StdioServerTransport();
server.connect(transport).then(() => {
    console.error("🚀 AI Newsletter MCP Server running on stdio");
});

