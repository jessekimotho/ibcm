import Dexie from 'dexie';

// Creating a new database instance
const db = new Dexie('BibleDatabase');

// Define the database schema
db.version(1).stores({
    books: 'bookName',
    chapters: '[bookName+chapterNumber],bookName', 
    verses: '[bookName+chapterNumber+verseNumber],bookName,chapterNumber', 
    daily_entries: '++id, date, year1_passages, year2_passages, revised_memory_verse, used_prayer_journal, daily_notes, meditation_verse, planner_tasks'
});

export default db;
