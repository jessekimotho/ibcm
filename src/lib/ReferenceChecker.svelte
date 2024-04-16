<script>
	import db from '$lib/js/db.js';

	let userInput = '';
	let versesOutput = [];
	let errorMessage = '';
	let classification = '';

	async function singleChapterSearch(bookName, chapterNumber) {
		try {
			// Fetch the book based on the name
			const book = await db.books.where({ name: bookName }).first();
			if (!book) {
				errorMessage = `Book not found: ${bookName}`;
				return;
			}

			// Fetch the chapter ID based on the book ID and chapter number
			const chapter = await db.chapters
				.where({ book_id: book.id, number: Number(chapterNumber) })
				.first();
			if (!chapter) {
				errorMessage = `Chapter not found: ${chapterNumber} in ${bookName}`;
				return;
			}

			// Fetch all verses from the found chapter
			versesOutput = await db.verses.where({ chapter_id: chapter.id }).toArray();
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

	function classifyAndFetch() {
		errorMessage = '';
		versesOutput = [];
		classification = '';

		const trimmedInput = userInput.trim();
		if (/^[\w\s]+\s\d+$/.test(trimmedInput)) {
			classification = 'Single Chapter';
			const [_, bookName, chapterNumber] = trimmedInput.match(/^([\w\s]+)\s(\d+)$/);
			singleChapterSearch(bookName, chapterNumber);
		} else if (/^[\w\s]+\s\d+:\d+$/.test(trimmedInput)) {
			classification = 'Single Verse';
		} else if (/^[\w\s]+\s\d+:\d+-\d+$/.test(trimmedInput)) {
			classification = 'Verse Range';
		} else if (/^[\w\s]+\s\d+-\d+$/.test(trimmedInput)) {
			classification = 'Chapter Range';
		} else {
			classification = 'Invalid Format';
			errorMessage =
				'Invalid input format. Please enter a valid format (e.g., Genesis 1, Genesis 1:1, Genesis 1:1-3, Genesis 3-4).';
		}
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
	<ul>
		{#each versesOutput as verse}
			<li>{verse.text}</li>
		{/each}
	</ul>
</div>
