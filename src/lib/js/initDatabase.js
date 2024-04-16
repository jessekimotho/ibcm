import db from '$lib/js/db.js';

const bookNames = ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi", "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"];


async function importBooks() {
    try {
        await db.transaction('rw', db.books, db.chapters, db.verses, async () => {
            await db.books.clear();
            await db.chapters.clear();
            await db.verses.clear();

            for (const book of bookNames) {
                const fileName = book.replace(/\s/g, ''); // Convert names to filenames
                
                try {
                    const response = await fetch(`/bible/${fileName}.json`);
                    const data = await response.json();
                    
                    const bookId = await db.books.add({ name: book });
    
                    // Prepare chapters
                    const chapters = data.chapters.map(chapter => ({
                        book_id: bookId,
                        number: chapter.chapter
                    }));
    
                    // Use bulkAdd and wait for the result to get chapter IDs
                    const chapterIds = await db.chapters.bulkAdd(chapters, { returnKeys: true });
    
                    // Prepare verses using returned chapter IDs
                    const verses = [];
                    data.chapters.forEach((chapter, index) => {
                        chapter.verses.forEach(verse => {
                            verses.push({
                                chapter_id: chapterIds[index],  // Ensure chapter IDs are correctly mapped
                                text: verse.text
                            });
                        });
                    });
    
                    // Add all verses in bulk
                    await db.verses.bulkAdd(verses);
                } catch (error) {
                    console.error(`Error importing ${book}:`, error);
                }
            }
        }).catch(e => {
            // Handle transaction error
            console.error('Transaction error:', e);
            throw e; // Re-throw to ensure the outer try/catch block captures it
        });

        console.log('Import successful!');
    } catch (error) {
        console.error('Failed to import books:', error);
    }
}

export default importBooks;
