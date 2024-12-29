import Dexie from 'dexie';

// Creating a new database instance
const db = new Dexie('BibleDatabase');

// Define the database schema
db.version(1).stores({
    app_settings: '++id',
    books: 'bookName',  // Set 'bookName' as the primary key.
    chapters: '[bookName+chapterNumber], bookName, chapterNumber', // Ensure both 'bookName' and 'chapterNumber' are indexed, plus a compound index.
    verses: '[bookName+chapterNumber+verseNumber], bookName, chapterNumber, verseNumber', // Compound index plus individual indexes.
    daily_entries: '++id, date, y1p1, y2p2, y1p3, y1p4, y2p1, prayer_passage, revised_memory_verse, used_prayer_journal, journal_entry, intention', // Including all fields that might be useful to index if queries are made on these.
    planner_entries: '++id, date, hour, event',
    prayers: '++id, category, request, dateCreated, dateAnswered, isAnswered'
});

export default db;
