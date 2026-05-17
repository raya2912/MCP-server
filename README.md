# AI-Powered Newsletter Generator (MCP)

## 1. Project Overview
This project is an AI-powered newsletter generation system built using the Model Context Protocol (MCP). It dynamically creates structured newsletters covering 8 distinct sections and provides automated NLP analytics (word count, reading time, sentiment, and keywords).

## 2. Architecture Explanation
The project is built on Node.js and uses the MCP SDK. It exposes two core tools:
- `generate_newsletter`: Uses OpenAI's API to dynamically write content based on structured prompt templates.
- `analyze_newsletter`: Uses local processing to parse the generated markdown, calculate word frequencies, estimate reading time, and score sentiment.

The MCP Server runs over `stdio`, allowing it to be integrated easily into local LLM clients like Claude Desktop, or run standalone via the CLI.

## 3. Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API Key (optional but recommended for actual text generation)

## 4. Installation Steps
1. Clone the repository or extract the files.
2. Open your terminal in the project root.
3. Run `npm install` to install the MCP SDK and dotenv.

## 5. Environment Variable Setup
1. Copy `.env.example` and rename it to `.env`.
2. Open `.env` and paste your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

## 6. How to Start the MCP Server
To start the raw MCP server (which communicates via standard input/output):
```bash
npm start
```
*(Note: Because it uses stdio, it will appear to hang. This is normal, as it is waiting for JSON-RPC messages. Press Ctrl+C to exit).*

## 7. How to Generate Newsletter & 8. Run Analytics via CLI
To use the application manually as a standard Node app:
```bash
npm run cli
```
Follow the on-screen prompts to enter a topic. It will automatically generate the newsletter, save it to the `/outputs` folder, and print out analytics (saving the JSON to `/analytics`).

## 9. Example CLI Commands
```bash
npm install
npm run cli
# Topic: Quantum Computing in AI
```

## 10. How to Use with Claude (MCP Integration)
To use this server as a tool inside Claude Desktop:

1. Open your Claude Desktop configuration file (e.g., `claude_desktop_config.json`).
2. Add the following entry to your `mcpServers` block:
   ```json
   {
     "mcpServers": {
       "newsletter-generator": {
         "command": "node",
         "args": ["/absolute/path/to/ai-newsletter-mcp/server/index.js"]
       }
     }
   }
   ```
3. Restart Claude Desktop.
4. Ask Claude: "Please generate a newsletter about Agentic Workflows using the generate_newsletter tool, and then analyze the result."

## 11. Future Improvements (For Final Year Project)
- **Database Integration:** Connect MongoDB or PostgreSQL to track user historical generated newsletters and trends over time.
- **Advanced NLP:** Replace heuristic sentiment analysis with a local HuggingFace model or an LLM call.
- **Web UI:** Build a React.js or Next.js frontend to visualize the analytics using charting libraries like Recharts or Chart.js.
- **Email Dispatch:** Integrate SendGrid or Nodemailer to automatically email the generated newsletter to a list of subscribers.

## 12. Automated Scheduling & Email Delivery

The project includes an automated workflow that generates, analyzes, and emails newsletters without manual intervention.

### 📧 Email Configuration
This system uses `nodemailer`. To send emails (e.g., via Gmail):
1. Go to your Google Account > Security.
2. Enable 2-Step Verification.
3. Search for "App Passwords" and generate a new password for this app.
4. Add the credentials to your `.env` file:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-char-app-password
   ```
*(Security Note: Never commit your `.env` file or actual password to GitHub!)*

### ⏰ Scheduler Configuration
Edit the `config/schedulerConfig.json` file to manage delivery:

**Demo Mode (Every 5 minutes)**:
```json
{ "mode": "interval", "intervalMinutes": 5 }
```

**Production Mode (Daily at 8:00 AM)**:
```json
{ "mode": "daily", "dailyTime": "08:00" }
```

### 🚀 How to Run the Scheduler
The scheduler boots up automatically when the MCP server runs. However, to run the scheduler independently for testing:
```bash
npm run scheduler
```

### 📋 Logging & Common Errors
All automated actions are logged inside the `/logs` directory. 
- **SMTP Authentication Error**: Check that you are using a Google *App Password* and not your standard login password.
- **Empty Output**: Ensure your `GEMINI_API_KEY` is valid.
