import Dexie from 'dexie';

const db = new Dexie('BibleDatabase');

db.version(1).stores({
    books: '++id, name',
    chapters: '++id, book_id, number',
    verses: '++id, chapter_id, text'
});



export default db;