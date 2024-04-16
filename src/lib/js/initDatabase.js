import db from './db';


const bookNames = [
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
    "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
    "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", 
    "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
    "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
    "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon",
    "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"
];

async function importBooks() {
    const fetchPromises = bookNames.map(book => {
        const fileName = book.replace(/\s/g, '');
        return fetch(`/bible/${fileName}.json`)
            .then(res => res.json())
            .then(data => ({ book, data }))
            .catch(error => console.error(`Error fetching data for ${book}:`, error));
    });

    const booksData = await Promise.all(fetchPromises);
    const filteredBooksData = booksData.filter(i => i !== null);

    try {
        await db.transaction('rw', db.books, db.chapters, db.verses, async () => {
            for (const { book, data } of filteredBooksData) {
                await db.books.add({ name: book });
                for (const chapter of data.chapters) {
                    await db.chapters.add({
                        book_name: book,
                        number: chapter.chapter // Ensure 'number' matches the key path exactly
                    });
                    for (const verse of chapter.verses) {
                        await db.verses.add({
                            book_name: book,
                            chapter_number: chapter.chapter,
                            verse_number: verse.verse,
                            text: verse.text // Ensure these match the compound key definition
                        });
                    }
                    
                }
                 console.log(`Import successful for ${book}!`);
            }
        });
        console.log('Import successful!');
    } catch (error) {
        console.error('Error during database transaction:', error);
    }
}

export default importBooks;
