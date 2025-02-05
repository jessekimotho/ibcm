import Dexie from 'dexie';

// Creating a new database instance
const db = new Dexie('BibleDatabase');

// Define the database schema with only day and month for daily_references
db.version(1).stores({
    app_settings: '++id',
    books: 'bookName',  // Set 'bookName' as the primary key.
    chapters: '[bookName+chapterNumber], bookName, chapterNumber', // Ensure both 'bookName' and 'chapterNumber' are indexed, plus a compound index.
    verses: '[bookName+chapterNumber+verseNumber], bookName, chapterNumber, verseNumber', // Compound index plus individual indexes.
    
    // In daily_references table, store 'day' and 'month' as composite key
    daily_references: '[day+month], y1p1, y1p2, y1p3, y1p4, y2p1, y2p2, prayer_passage',

    // Keep the daily_entries table as it is for user-specific data
    daily_entries: '++id, [day+month+year], userId, day, month, year, journal_entry, intention, revised_memory_verse, used_prayer_journal',

    planner_entries: '++id, [day+month+year], hour, event',
    prayers: '++id, category, request, dateCreated, dateAnswered, isAnswered, order'
});

export default db;
