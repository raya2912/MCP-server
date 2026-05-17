import { getDailyUpdatePrompt, getSummaryPrompt } from '../prompts/index.js';
import { config } from '../config/env.js';
import { getTopicHistoryContext, addTopicHistory } from '../history/manager.js';

async function callLLM(prompt) {
    // Fallback mock if no API key is set
    if (!config.openAiApiKey) {
        return `*Mocked content for prompt:* ${prompt.substring(0, 50)}...\n(Set OPENAI_API_KEY to generate real content).`;
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.openAiApiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7
            })
        });
        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message);
        }
        return data.choices[0].message.content;
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
