export function getSectionPrompt(topic, section) {
    const baseContext = `You are an expert AI technical writer generating a newsletter about: "${topic}".`;
    
    const directives = {
        "Introduction": `Write a brief, engaging introduction (approx 100 words) highlighting the importance of "${topic}" this week.`,
        "Big Story of the Week": `Identify the most impactful recent development related to "${topic}". Provide a detailed 150-word analysis.`,
        "Quick Updates": `Provide 3 to 5 concise bullet points covering minor but noteworthy updates around "${topic}".`,
        "Top Research Papers": `Summarize 2 recent academic papers related to "${topic}". Include title, authors, and a 50-word summary.`,
        "Top GitHub Repositories": `List 3 trending open-source GitHub repositories relevant to "${topic}". Provide the repo name and a short description.`,
        "Quick Tutorial": `Provide a very short, 3-step practical tutorial or code snippet related to a concept in "${topic}".`,
        "Top AI Products": `Highlight 2 innovative AI products or startups making waves in the space of "${topic}".`,
        "Top X Posts": `Highlight 2 viral X (Twitter) discussions that experts are having right now about "${topic}".`
    };

    return `${baseContext}\n\nTask: ${directives[section] || `Write about ${section}.`}\n\nFormat your output in clean Markdown. Do NOT include the section title as a header, just provide the content.`;
}
