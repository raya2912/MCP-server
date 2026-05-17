import { GoogleGenerativeAI } from '@google/generative-ai';
import { getDailyUpdatePrompt, getSummaryPrompt } from '../prompts/index.js';
import { config } from '../config/env.js';
import { getTopicHistoryContext, addTopicHistory } from '../history/manager.js';

async function callLLM(prompt) {
    // Fallback mock if no API key is set
    if (!config.geminiApiKey) {
        return `*Mocked content for prompt:* ${prompt.substring(0, 50)}...\n(Set GEMINI_API_KEY to generate real content).`;
    }

    try {
        const genAI = new GoogleGenerativeAI(config.geminiApiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        return `*Error generating content:* ${error.message}`;
    }
}

export async function generateDailyUpdate(topic) {
    const historyContext = getTopicHistoryContext(topic);
    
    // Generate the main update
    const updatePrompt = getDailyUpdatePrompt(topic, historyContext);
    const updateContent = await callLLM(updatePrompt);
    
    // Generate the summary for memory
    const summaryPrompt = getSummaryPrompt(topic, updateContent);
    const summary = await callLLM(summaryPrompt);
    
    // Save to memory
    addTopicHistory(topic, summary);
    
    let finalContent = `# Daily AI Update: ${topic}\n\n`;
    finalContent += `*Generated on: ${new Date().toLocaleDateString()}*\n\n`;
    finalContent += updateContent;
    
    return finalContent;
}

// Keep the old function signature as a wrapper for backward compatibility with external MCP calls if needed,
// but route it to the new daily update logic.
export async function generateNewsletterContent(topic) {
    return generateDailyUpdate(topic);
}
