import { generateNewsletterContent } from '../tools/newsletter.js';
import { analyzeNewsletterContent } from '../tools/analytics.js';
import readline from 'readline';
import fs from 'fs';
import path from 'path';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("=====================================");
console.log(" 📰 AI Newsletter Generator CLI");
console.log("=====================================\n");

rl.question('Enter the topic for your newsletter (e.g., Agents in AI): ', async (topic) => {
    console.log(`\n⏳ Generating newsletter for "${topic}"... (This may take a minute)`);
    
    const content = await generateNewsletterContent(topic);
    
    const outPath = path.join(process.cwd(), 'outputs', `cli-newsletter-${Date.now()}.md`);
    fs.writeFileSync(outPath, content);
    console.log(`✅ Newsletter saved to ${outPath}`);

    console.log(`\n⏳ Analyzing newsletter...`);
    const analytics = analyzeNewsletterContent(content);
    
    const anPath = path.join(process.cwd(), 'analytics', `cli-analytics-${Date.now()}.json`);
    fs.writeFileSync(anPath, JSON.stringify(analytics, null, 2));
    
    console.log("\n📊 ANALYTICS RESULTS:");
    console.log(`- Words: ${analytics.totalWords}`);
    console.log(`- Time to Read: ${analytics.readingTime}`);
    console.log(`- Sentiment: ${analytics.sentiment}`);
    console.log(`- Top Keywords: ${analytics.topKeywords.join(', ')}`);
    console.log(`✅ Full JSON saved to ${anPath}\n`);

    rl.close();
});


