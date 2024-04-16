import db from '$lib/js/db.js';

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
            .catch(error => {
                console.error(`Error fetching data for ${book}:`, error);
                return null;
            });
    });

    const booksData = await Promise.all(fetchPromises);
    const filteredBooksData = booksData.filter(i => i !== null); // Ensure only successful fetches are processed

    try {
        await db.transaction('rw', db.books, db.chapters, db.verses, async () => {
            for (const { book, data } of filteredBooksData) {
                const bookId = await db.books.add({ name: book });
                for (const chapter of data.chapters) {
                    const chapterId = await db.chapters.add({
                        book_id: bookId,
                        number: chapter.chapter
                    });
                    const verses = chapter.verses.map(verse => ({
                        chapter_id: chapterId,
                        number: verse.verse, // Assuming your JSON has verse numbers
                        text: verse.text
                    }));
                    await db.verses.bulkAdd(verses);
                }
                console.log(`Import successful for ${book}!`);
            }
        });
    } catch (error) {
        console.error(`Error during database transaction:`, error);
    }
}

export default importBooks;