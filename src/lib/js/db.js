import Dexie from 'dexie';

// Creating a new database instance
const db = new Dexie('BibleDatabase');

// Define the database schema
db.version(1).stores({
    books: 'name', // 'name' of the book as the primary key
    chapters: '[book_name+number],book_name', // Compound primary key for chapters and a secondary index on book_name
    verses: '[book_name+chapter_number+verse_number],book_name,chapter_number' // Compound primary key for verses and secondary indexes on book_name and chapter_number
});

export default db;
