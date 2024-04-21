// methods.js
import db from './db.js';

export async function fetchSingleChapter(bookName, chapterNumber) {
    const book = await db.books.where('bookName').equals(bookName).first();
    if (!book) {
        return { errorMessage: `Book not found: ${bookName}`, chaptersOutput: [] };
    }

    const chapter = await db.chapters
        .where({ bookName: bookName, chapterNumber: chapterNumber })
        .first();
    if (!chapter) {
        return { errorMessage: `Chapter not found: ${chapterNumber} in ${bookName}`, chaptersOutput: [] };
    }

    const verses = await db.verses
        .where({ bookName: bookName, chapterNumber: chapterNumber })
        .toArray();

    return {
        chaptersOutput: [{
            chapterNumber: chapterNumber,
            verses: verses
        }],
        classification: 'Single Chapter'
    };
}

export async function fetchSingleVerse(bookName, chapterNumber, verseNumber) {
    const chapter = await db.chapters
        .where({ bookName: bookName, chapterNumber: chapterNumber })
        .first();
    if (!chapter) {
        return { errorMessage: `Chapter not found: ${chapterNumber} in ${bookName}`, chaptersOutput: [] };
    }

    const verse = await db.verses
        .where({ bookName: bookName, chapterNumber: chapterNumber, verseNumber: verseNumber })
        .first();
    if (!verse) {
        return { errorMessage: `Verse not found: ${verseNumber} in chapter ${chapterNumber} of ${bookName}`, chaptersOutput: [] };
    }

    return {
        chaptersOutput: [{
            chapterNumber: chapter.chapterNumber,
            verses: [verse]
        }],
        classification: 'Single Verse'
    };
}

export async function fetchVerseRange(bookName, chapterNumber, startVerse, endVerse) {
    const verses = await db.verses
        .where('[bookName+chapterNumber+verseNumber]')
        .between([bookName, chapterNumber, startVerse], [bookName, chapterNumber, endVerse], true, true)
        .toArray();

    if (verses.length === 0) {
        return { errorMessage: `No verses found from verse ${startVerse} to ${endVerse} in chapter ${chapterNumber} of ${bookName}`, chaptersOutput: [] };
    }

    return {
        chaptersOutput: [{
            chapterNumber: chapterNumber,
            verses: verses.map(verse => ({
                verseNumber: verse.verseNumber,
                text: verse.text
            }))
        }],
        classification: 'Verse Range'
    };
}

export async function fetchChapterRange(bookName, startChapter, endChapter) {
    const chapters = await db.chapters
        .where('[bookName+chapterNumber]')
        .between([bookName, startChapter], [bookName, endChapter], true, true)
        .toArray();

    if (chapters.length === 0) {
        return { errorMessage: `No chapters found from ${startChapter} to ${endChapter} in ${bookName}`, chaptersOutput: [] };
    }

    return {
        chaptersOutput: chapters.map(chapter => ({
            chapterNumber: chapter.chapterNumber,
            verses: chapter.verses // Assuming you fetch verses in a separate query
        })),
        classification: 'Chapter Range'
    };
}

export async function fetchCrossChapterRange(bookName, startChapter, startVerse, endChapter, endVerse) {
    const chapters = await db.chapters
        .where('[bookName+chapterNumber]')
        .between([bookName, startChapter], [bookName, endChapter], true, true)
        .toArray();

    if (chapters.length === 0) {
        return { errorMessage: `No chapters found from ${startChapter} to ${endChapter} in ${bookName}`, chaptersOutput: [] };
    }

    let verses = [];

    for (const chapter of chapters) {
        if (chapter.chapterNumber === startChapter && chapter.chapterNumber === endChapter) {
            // Range within the same chapter
            const versesInRange = await db.verses
                .where('[bookName+chapterNumber+verseNumber]')
                .between([bookName, chapter.chapterNumber, startVerse], [bookName, chapter.chapterNumber, endVerse], true, true)
                .toArray();
            verses = verses.concat(versesInRange);
        } else if (chapter.chapterNumber === startChapter) {
            // Start chapter, from startVerse to the end of the chapter
            const versesFromStart = await db.verses
                .where('[bookName+chapterNumber+verseNumber]')
                .between([bookName, chapter.chapterNumber, startVerse], [bookName, chapter.chapterNumber, Infinity], true, true)
                .toArray();
            verses = verses.concat(versesFromStart);
        } else if (chapter.chapterNumber === endChapter) {
            // End chapter, from the start of the chapter to endVerse
            const versesToEnd = await db.verses
                .where('[bookName+chapterNumber+verseNumber]')
                .between([bookName, chapter.chapterNumber, 1], [bookName, chapter.chapterNumber, endVerse], true, true)
                .toArray();
            verses = verses.concat(versesToEnd);
        } else {
            // Full chapters in between
            const allVerses = await db.verses
                .where('[bookName+chapterNumber]')
                .equals([bookName, chapter.chapterNumber])
                .toArray();
            verses = verses.concat(allVerses);
        }
    }

    return {
        chaptersOutput: chapters.map(chapter => ({
            chapterNumber: chapter.chapterNumber,
            verses: verses.filter(verse => verse.chapterNumber === chapter.chapterNumber)
        })),
        classification: 'Cross-Chapter Verse Range'
    };
}


export function capitalizeInput(input) {
    return input.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export function classifyAndFetch(reference) {
    const trimmedInput = reference.trim();

    // Enhanced regex to handle cross-chapter verse range as well as simpler cases
    const regex = /^(\d*\s*\w+[\w\s]*?)\s+(\d+)(:\d+)?(-(\d+)(:\d+)?)?$/;
    const match = trimmedInput.match(regex);

    if (!match) {
        return { errorMessage: 'Invalid input format. Please enter a valid format.', chaptersOutput: [] };
    }

    const bookName = match[1].trim();
    const startChapter = parseInt(match[2], 10);
    const startVerse = match[3] ? parseInt(match[3].slice(1), 10) : 1; // default to verse 1 if not specified
    const endChapter = match[5] ? parseInt(match[5], 10) : startChapter;
    const endVerse = match[6] ? parseInt(match[6].slice(1), 10) : (match[4] ? parseInt(match[4].slice(1), 10) : startVerse); // default endVerse to startVerse if not specified


    // Capitalize each word for consistency in database queries
    const formattedBookName = bookName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

    // Determine what type of data to fetch based on the parsed input
    if (match[6]) { // Cross-chapter verse range
        return fetchCrossChapterRange(formattedBookName, startChapter, startVerse, endChapter, endVerse);
    } else if (match[3] && match[4]) { // Single chapter verse range
        return fetchVerseRange(formattedBookName, startChapter, startVerse, endVerse);
    } else if (match[3]) { // Single verse
        return fetchSingleVerse(formattedBookName, startChapter, startVerse);
    } else if (match[4]) { // Chapter range
        return fetchChapterRange(formattedBookName, startChapter, endChapter);
    } else { // Single chapter
        return fetchSingleChapter(formattedBookName, startChapter);
    }
}
