<script>
	import db from '$lib/js/db.js';

	let userInput = '';
	let versesOutput = [];
	let errorMessage = '';

	async function fetchVerses() {
		versesOutput = [];
		errorMessage = '';

		// Enhanced regex to handle spaces around input parts
		const match = userInput
			.trim()
			.match(/^(\w+)\s+(\d+)(?:\s*:\s*(\d+))?(?:\s*-\s*(\d+)(?:\s*:\s*(\d+))?)?$/);
		if (!match) {
			errorMessage =
				"Invalid input format. Please ensure the format matches 'Book Chapter', 'Book Chapter:Verse', 'Book Chapter:Verse-Verse', or 'Book Chapter-Chapter'.";
			return;
		}

		const [, bookName, startChapter, startVerse, endChapterOrVerse, endVerse] = match;

		try {
			const book = await db.books.where({ name: bookName }).first();
			if (!book) {
				errorMessage = `Book not found: ${bookName}`;
				return;
			}

			let query;
			if (startVerse) {
				if (endChapterOrVerse && !endVerse) {
					// Verse range within the same chapter
					query = db.verses
						.where({ chapter_id: Number(startChapter) })
						.and(
							(verse) =>
								verse.number >= Number(startVerse) && verse.number <= Number(endChapterOrVerse)
						);
				} else if (endVerse) {
					// Verse range spanning multiple chapters (adjust logic here if necessary)
					query = db.verses
						.where('chapter_id')
						.between(Number(startChapter), Number(endChapterOrVerse))
						.and((verse) => verse.number >= Number(startVerse) && verse.number <= Number(endVerse));
				} else {
					// Single verse
					query = db.verses.where({ chapter_id: Number(startChapter), number: Number(startVerse) });
				}
			} else if (endChapterOrVerse) {
				// Chapter range
				query = db.verses
					.where('chapter_id')
					.between(Number(startChapter), Number(endChapterOrVerse));
			} else {
				// Entire single chapter
				query = db.verses.where({ chapter_id: Number(startChapter) });
			}

			versesOutput = await query.toArray();

			if (versesOutput.length == 0) {
				errorMessage = 'No verses found for the specified range.';
			}
		} catch (error) {
			console.error('Error fetching verses:', error);
			errorMessage = 'Failed to fetch verses due to an error.';
		}
	}
</script>

<div>
	<input
		type="text"
		bind:value={userInput}
		placeholder="e.g., Genesis 1, Genesis 1:1, Genesis 1:1-3, Genesis 3-4"
	/>
	<button on:click={fetchVerses}>Fetch Verses</button>
	{#if errorMessage}
		<p class="error">{errorMessage}</p>
	{/if}
	<ul>
		{#each versesOutput as verse}
			<li>{verse.text}</li>
		{/each}
	</ul>
</div>
