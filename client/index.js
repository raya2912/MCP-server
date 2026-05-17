import { generateDailyUpdate } from '../tools/newsletter.js';
import { analyzeNewsletterContent } from '../tools/analytics.js';
import readline from 'readline';
import fs from 'fs';
import path from 'path';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("=====================================");
console.log(" 🧠 Intelligent Topic Tracking CLI");
console.log("=====================================\n");

rl.question('Enter the topic you want to track or update (e.g., Agents in AI): ', async (topic) => {
    console.log(`\n⏳ Generating daily update for "${topic}"... (This may take a minute)`);
    
    const content = await generateDailyUpdate(topic);
    
    const safeTopicName = topic.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const outPath = path.join(process.cwd(), 'outputs', `cli-update-${safeTopicName}-${Date.now()}.md`);
    fs.writeFileSync(outPath, content);
    console.log(`✅ Daily Update saved to ${outPath}`);

    console.log(`\n⏳ Analyzing update content...`);
    const analytics = analyzeNewsletterContent(content);
    
    const anPath = path.join(process.cwd(), 'analytics', `cli-analytics-${safeTopicName}-${Date.now()}.json`);
    fs.writeFileSync(anPath, JSON.stringify(analytics, null, 2));
    
    console.log("\n📊 ANALYTICS RESULTS:");
    console.log(`- Words: ${analytics.totalWords}`);
    console.log(`- Time to Read: ${analytics.readingTime}`);
    console.log(`- Sentiment: ${analytics.sentiment}`);
    console.log(`- Top Keywords: ${analytics.topKeywords.join(', ')}`);
    console.log(`✅ Full JSON saved to ${anPath}\n`);

    rl.close();
});
