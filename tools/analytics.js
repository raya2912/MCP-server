export function analyzeNewsletterContent(content) {
    const cleanText = content.replace(/[^\w\s]/g, '').toLowerCase();
    const words = cleanText.split(/\s+/).filter(w => w.length > 0);
    const totalWords = words.length;

    // Estimate Reading Time (avg 200 words per min)
    const readingTimeMinutes = Math.ceil(totalWords / 200);

    // Basic Sentiment Analysis
    const positiveWords = new Set(['breakthrough', 'innovative', 'best', 'great', 'success', 'advance', 'discover', 'growth', 'positive']);
    const negativeWords = new Set(['fail', 'issue', 'problem', 'bad', 'error', 'decline', 'risk', 'threat', 'negative', 'limitation']);
    
    let sentimentScore = 0;
    words.forEach(w => {
        if (positiveWords.has(w)) sentimentScore++;
        if (negativeWords.has(w)) sentimentScore--;
    });
    
    let sentiment = 'neutral';
    if (sentimentScore > 2) sentiment = 'positive';
    else if (sentimentScore < -2) sentiment = 'negative';

    // Extract Top Keywords (Frequency based, omitting stopwords)
    const stopWords = new Set(['the', 'is', 'in', 'and', 'to', 'of', 'a', 'for', 'on', 'with', 'as', 'by', 'an', 'this', 'that', 'it', 'are', 'from', 'be', 'mocked', 'content', 'prompt']);
    const frequencies = {};
    words.forEach(w => {
        if (!stopWords.has(w) && w.length > 4) {
            frequencies[w] = (frequencies[w] || 0) + 1;
        }
    });
    
    const topKeywords = Object.entries(frequencies)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(entry => entry[0]);

    // Section-wise Length Distribution
    const sections = content.split(/^## /m).filter(s => s.trim().length > 0);
    const sectionDistribution = {};
    
    sections.forEach(sec => {
        const lines = sec.split('\n');
        const title = lines[0].trim();
        const sectionWords = lines.slice(1).join(' ').split(/\s+/).filter(w => w.length > 0).length;
        if (title && sectionWords > 0) {
            sectionDistribution[title] = sectionWords;
        }
    });

    return {
        totalWords,
        readingTime: `${readingTimeMinutes} min read`,
        sentiment,
        sentimentScore,
        topKeywords,
        sectionDistribution
    };
}
