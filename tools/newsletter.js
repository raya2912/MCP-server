import { getSectionPrompt } from '../prompts/index.js';
import { config } from '../config/env.js';

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
        return data.choices[0].message.content;
    } catch (error) {
        return `*Error generating content:* ${error.message}`;
    }
}

export async function generateNewsletterContent(topic) {
    const sections = [
        "Introduction", 
        "Big Story of the Week", 
        "Quick Updates",
        "Top Research Papers", 
        "Top GitHub Repositories",
        "Quick Tutorial", 
        "Top AI Products", 
        "Top X Posts"
    ];

    let content = `# Weekly AI Newsletter: ${topic}\n\n`;

    for (const section of sections) {
        content += `## ${section}\n\n`;
        const prompt = getSectionPrompt(topic, section);
        const sectionContent = await callLLM(prompt);
        content += sectionContent.trim() + "\n\n";
    }

    return content;
}
