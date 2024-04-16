<script>
	import db from '$lib/js/db.js';

	let userInput = '';
	let versesOutput = [];
	let errorMessage = '';
	let classification = '';

	async function singleChapterSearch(bookName, chapterNumber) {
		try {
			const bookNameTrimmed = bookName.trim();
			const chapterKey = [bookNameTrimmed, chapterNumber];

			const chapter = await db.chapters.get(chapterKey);
			if (!chapter) {
				errorMessage = `Chapter not found: ${chapterNumber} in ${bookName}`;
				return;
			}

			versesOutput = await db.verses
				.where('[book_name+chapter_number]')
				.equals([bookNameTrimmed, chapterNumber])
				.toArray();

			errorMessage = versesOutput.length === 0 ? 'No verses found for the specified chapter.' : '';
		} catch (error) {
			console.error('Error fetching verses:', error);
			errorMessage = 'Failed to fetch verses due to an error.';
		}
	}

	async function singleVerseSearch(bookName, chapterNumber, verseNumber) {
		try {
			const bookNameTrimmed = bookName.trim();
			const verseKey = [bookNameTrimmed, chapterNumber, verseNumber];

			const verse = await db.verses.get(verseKey);
			if (!verse) {
				errorMessage = `Verse not found: ${verseNumber} in ${bookName} chapter ${chapterNumber}`;
				versesOutput = [];
				return;
			}

			versesOutput = [verse];
			errorMessage = '';
		} catch (error) {
			console.error('Error fetching verse:', error);
			errorMessage = 'Failed to fetch verse due to an error.';
		}
	}

	async function fetchVerseRange(bookName, chapterNumber, startVerse, endVerse) {
		try {
			const bookNameTrimmed = bookName.trim();
			const startKey = [bookNameTrimmed, chapterNumber, startVerse];
			const endKey = [bookNameTrimmed, chapterNumber, endVerse];

			versesOutput = await db.verses
				.where('[book_name+chapter_number+verse_number]')
				.between(startKey, endKey, true, true)
				.toArray();

			errorMessage =
				versesOutput.length === 0
					? `No verses found from ${startVerse} to ${endVerse} in ${bookName} chapter ${chapterNumber}.`
					: '';
		} catch (error) {
			console.error('Error fetching verse range:', error);
			errorMessage = `Failed to fetch verse range due to an error: ${error.message}`;
		}
	}

	function classifyAndFetch() {
		const trimmedInput = userInput.trim();
		const formattedInput = capitalizeInput(trimmedInput);

		errorMessage = '';
		versesOutput = [];
		classification = '';

		if (/^[\w\s]+\s\d+$/.test(formattedInput)) {
			const [_, bookName, chapterNumber] = formattedInput.match(/^([\w\s]+)\s(\d+)$/);
			singleChapterSearch(bookName, parseInt(chapterNumber, 10));
			classification = 'Single Chapter';
		} else if (/^[\w\s]+\s\d+:\d+$/.test(formattedInput)) {
			const match = formattedInput.match(/^([\w\s]+)\s(\d+):(\d+)$/);
			if (match && match.length >= 4) {
				const [_, bookName, chapterNumber, verseNumber] = match;
				singleVerseSearch(bookName, parseInt(chapterNumber, 10), parseInt(verseNumber, 10));
				classification = 'Single Verse';
			} else {
				errorMessage =
					'Invalid input format for a verse. Please ensure it matches "BookName Chapter:Verse".';
			}
		} else if (/^[\w\s]+\s\d+:\d+-\d+$/.test(formattedInput)) {
			const [_, bookName, chapterNumber, startVerse, endVerse] = formattedInput.match(
				/^([\w\s]+)\s(\d+):(\d+)-(\d+)$/
			);
			if (bookName && chapterNumber && startVerse && endVerse) {
				fetchVerseRange(
					bookName,
					parseInt(chapterNumber, 10),
					parseInt(startVerse, 10),
					parseInt(endVerse, 10)
				);
				classification = 'Verse Range';
			} else {
				errorMessage =
					'Invalid input format for a verse range. Please ensure it matches "BookName Chapter:StartVerse-EndVerse".';
			}
		} else if (/^[\w\s]+\s\d+-\d+$/.test(trimmedInput)) {
			classification = 'Chapter Range';
			// Add logic for fetching a range of chapters
		} else {
			classification = 'Invalid Format';
			errorMessage =
				'Invalid input format. Please enter a valid format (e.g., Genesis 1, Genesis 1:1, Genesis 1:1-3, Genesis 3-4).';
		}
	}

	function capitalizeInput(input) {
		return input
			.toLowerCase()
			.split(' ')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
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
