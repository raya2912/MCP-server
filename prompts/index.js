export function getDailyUpdatePrompt(topic, previousHistory) {
    const today = new Date().toLocaleDateString();
    
    return `You are an expert AI technical researcher and analyst. Your task is to provide the daily update for the topic: "${topic}".
Assume today's date is ${today}.

### Context & Memory
To avoid repeating old information, here is a summary of what has already been covered in previous updates:
${previousHistory}

### Task
Generate a comprehensive but concise daily update on "${topic}". Focus ONLY on new developments, hypothetical recent trends, and fresh insights that do not overlap with the previous history. 

Your response must be formatted in Markdown and include exactly these sections:

## 📢 Latest Developments
(2-3 bullet points of the most crucial recent news or hypothetical updates)

## 🎯 Key Highlights
(A short 50-word paragraph summarizing why today's updates matter)

## 🧠 AI-Generated Insights
(A brief analysis of where this topic might be heading next)

## 📊 Concise Analysis
(A sharp, analytical breakdown of the current state of this topic)
`;
}

export function getSummaryPrompt(topic, updateContent) {
    return `You are a summarization AI.
    
I have generated the following daily update for the topic: "${topic}".

Update Content:
${updateContent}

Your task: Provide a very brief, 1-2 sentence summary of the key facts covered in this update. This summary will be saved to memory so we do not repeat these facts tomorrow.
Do not use formatting, just return the plain text summary.`;
}
