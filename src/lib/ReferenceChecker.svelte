<script>
    import db from '$lib/js/db.js';

    let userInput = '';
    let versesOutput = [];
    let errorMessage = '';
    let classification = '';

    async function singleChapterSearch(bookName, chapterNumber) {
        try {
            console.log("Searching for book:", bookName);
            const bookNameTrimmed = bookName.trim();
            const chapterKey = [bookNameTrimmed, chapterNumber.toString()];  // Ensure chapter number is a string

            const chapter = await db.chapters.get(chapterKey);
            if (!chapter) {
                errorMessage = `Chapter not found: ${chapterNumber} in ${bookName}`;
                return;
            }

            // Fetch verses using a specific key structure
            versesOutput = await db.verses
                .where('[book_name+chapter_number]')
                .equals([bookNameTrimmed, chapterNumber.toString()])
                .toArray();

            if (versesOutput.length === 0) {
                errorMessage = 'No verses found for the specified chapter.';
            } else {
                errorMessage = ''; // Clear any previous error messages
            }
        } catch (error) {
            console.error('Error fetching verses:', error);
            errorMessage = 'Failed to fetch verses due to an error.';
        }
    }

     async function singleVerseSearch(bookName, chapterNumber, verseNumber) {
        try {
            console.log("Searching for verse:", bookName, chapterNumber, verseNumber);
            const bookNameTrimmed = bookName.trim();
            const verseKey = [bookNameTrimmed, chapterNumber.toString(), verseNumber.toString()]; // Ensure all parts are string if stored as such

            const verse = await db.verses.get(verseKey);
            if (!verse) {
                errorMessage = `Verse not found: ${verseNumber} in ${bookName} chapter ${chapterNumber}`;
                versesOutput = []; // Clear previous verses
                return;
            }

            versesOutput = [verse]; // Display only the fetched verse
            errorMessage = ''; // Clear any previous error messages
        } catch (error) {
            console.error('Error fetching verse:', error);
            errorMessage = 'Failed to fetch verse due to an error.';
        }
    }
    
function classifyAndFetch() {
    const trimmedInput = userInput.trim();
    const formattedInput = capitalizeInput(trimmedInput); // Apply the capitalization function

    errorMessage = '';
    versesOutput = [];
    classification = '';

    if (/^[\w\s]+\s\d+$/.test(formattedInput)) {
        classification = 'Single Chapter';
        const [_, bookName, chapterNumber] = formattedInput.match(/^([\w\s]+)\s(\d+)$/);
        singleChapterSearch(bookName, chapterNumber);
    } else if (/^[\w\s]+\s\d+:\d+$/.test(formattedInput)) {
        classification = 'Single Verse';
        const [_, bookName, chapterVerse] = formattedInput.match(/^([\w\s]+)\s(\d+):(\d+)$/);
        if (chapterVerse) {
            const [chapterNumber, verseNumber] = chapterVerse.split(':');
            singleVerseSearch(bookName, chapterNumber, verseNumber);
        } else {
            errorMessage = 'Invalid input format for a verse. Please enter a valid format (e.g., Genesis 1:1).';
        }
    } else {
        classification = 'Invalid Format';
        errorMessage =
            'Invalid input format. Please enter a valid format (e.g., Genesis 1, Genesis 1:1, Genesis 1:1-3, Genesis 3-4).';
    }
}

function capitalizeInput(input) {
    return input.toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

</script>

<div>
    <input
        type="text"
        bind:value={userInput}
        on:input={classifyAndFetch}
        placeholder="Enter reference (e.g., Genesis 1, Genesis 1:1, Genesis 1:1-3, Genesis 3-4)"
    />
    <p>Classification: {classification}</p>
    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {/if}
    <ol>
        {#each versesOutput as verse}
            <li>{verse.text}</li>
        {/each}
    </ol>
</div>
