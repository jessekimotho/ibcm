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
            verses: verses
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

export function capitalizeInput(input) {
    return input.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export function classifyAndFetch(reference) {
    const trimmedInput = reference.trim();
    const formattedInput = capitalizeInput(trimmedInput);
    if (/^[\w\s]+\s\d+$/.test(formattedInput)) {
        const [bookName, chapterNumber] = formattedInput.split(' ');
        return fetchSingleChapter(bookName, parseInt(chapterNumber));
    } else if (/^[\w\s]+\s\d+:\d+$/.test(formattedInput)) {
        const [bookName, chapterVerse] = formattedInput.split(' ');
        const [chapterNumber, verseNumber] = chapterVerse.split(':');
        return fetchSingleVerse(bookName, parseInt(chapterNumber), parseInt(verseNumber));
    } else if (/^[\w\s]+\s\d+:\d+-\d+$/.test(formattedInput)) {
        const [bookName, chapterVerseRange] = formattedInput.split(' ');
        const [chapterNumber, verseRange] = chapterVerseRange.split(':');
        const [startVerse, endVerse] = verseRange.split('-');
        return fetchVerseRange(bookName, parseInt(chapterNumber), parseInt(startVerse), parseInt(endVerse));
    } else if (/^[\w\s]+\s\d+-\d+$/.test(trimmedInput)) {
        const [bookName, chapterRange] = formattedInput.split(' ');
        const [startChapter, endChapter] = chapterRange.split('-');
        return fetchChapterRange(bookName, parseInt(startChapter), parseInt(endChapter));
    } else {
        return { errorMessage: 'Invalid input format. Please enter a valid format.', chaptersOutput: [] };
    }
}
