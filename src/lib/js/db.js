import Dexie from 'dexie';

// Creating a new database instance
const db = new Dexie('BibleDatabase');

// Define the database schema
db.version(1).stores({
    books: 'bookName', // 'name' of the book as the primary key
    chapters: '[bookName+chapterNumber],bookName', // Compound primary key for chapters and a secondary index on book_name
    verses: '[bookName+chapterNumber+verseNumber],bookName,chapterNumber' // Compound primary key for verses and secondary indexes on book_name and chapter_number
});

export default db;
