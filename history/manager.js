import fs from 'fs';
import path from 'path';

const historyDir = path.join(process.cwd(), 'history');

// Ensure history directory exists
if (!fs.existsSync(historyDir)) {
    fs.mkdirSync(historyDir, { recursive: true });
}

function getHistoryFilePath(topic) {
    const sanitizedTopic = topic.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    return path.join(historyDir, `${sanitizedTopic}.json`);
}

export function getTopicHistory(topic) {
    const filePath = getHistoryFilePath(topic);
    if (!fs.existsSync(filePath)) {
        return [];
    }
    
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading history for topic ${topic}:`, error);
        return [];
    }
}

export function addTopicHistory(topic, updateSummary) {
    const filePath = getHistoryFilePath(topic);
    const history = getTopicHistory(topic);
    
    const newEntry = {
        date: new Date().toISOString(),
        summary: updateSummary
    };
    
    history.push(newEntry);
    
    // Keep only the last 10 updates to prevent prompt context from getting too large
    if (history.length > 10) {
        history.shift();
    }
    
    try {
        fs.writeFileSync(filePath, JSON.stringify(history, null, 2));
    } catch (error) {
        console.error(`Error saving history for topic ${topic}:`, error);
    }
}

export function getTopicHistoryContext(topic) {
    const history = getTopicHistory(topic);
    if (history.length === 0) {
        return "No previous updates. This is the first update for this topic.";
    }
    
    return history.map(entry => `[${new Date(entry.date).toLocaleDateString()}]: ${entry.summary}`).join('\n');
}
