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
    // Fetch and prepare data for all books
    const fetchPromises = bookNames.map(book => {
        const fileName = book.replace(/\s/g, '');  // Remove spaces for file names
        return fetch(`/bible/${fileName}.json`)
            .then(res => res.json())
            .then(data => ({ book, data }))
            .catch(error => {
                console.error(`Error fetching data for ${book}:`, error);
                return null; // Continue with other fetches even if one fails
            });
    });

    const booksData = await Promise.all(fetchPromises);
    const filteredBooksData = booksData.filter(i => i !== null);  // Filter out failed fetches

    try {
        // Use a transaction for all DB operations
        await db.transaction('rw', db.books, db.chapters, db.verses, async () => {
            for (const { book, data } of filteredBooksData) {
                // Add book, update if it already exists due to primary key constraint
                await db.books.put({ bookName: book });

                for (const chapter of data.chapters) {
                    const chapterNumber = parseInt(chapter.chapter); // Ensure chapter number is an integer
                    await db.chapters.put({
                        bookName: book,
                        chapterNumber: chapterNumber
                    });

                    for (const verse of chapter.verses) {
                        const verseNumber = parseInt(verse.verse); // Ensure verse number is an integer
                        await db.verses.put({
                            bookName: book,
                            chapterNumber: chapterNumber,
                            verseNumber: verseNumber,
                            text: verse.text
                        });
                    }
                }
                console.log(`Import successful for ${book}!`);  // Log successful import for each book
            }
        });

        console.log('Overall import process completed successfully!');
    } catch (error) {
        console.error('Error during database transaction:', error);
    }
}

export default importBooks;