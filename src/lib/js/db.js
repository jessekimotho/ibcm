import Dexie from 'dexie';

// Creating a new database instance
const db = new Dexie('BibleDatabase');

// Define the database schema
db.version(1).stores({
    books: 'bookName',
    chapters: '[bookName+chapterNumber],bookName', 
    verses: '[bookName+chapterNumber+verseNumber],bookName,chapterNumber', 
    daily_entries: '++id,date, y1p1, y2p2, y1p3, y1p4, y2p1, prayer_passage, revised_memory_verse, used_prayer_journal, daily_notes, planner_tasks'
});

export default db;
