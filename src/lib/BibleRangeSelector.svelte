<script>
	import db from '$lib/js/db.js';

	let userInput = '';
	let versesOutput = [];
	let errorMessage = '';

	async function fetchVerses() {
		versesOutput = [];
		errorMessage = '';

		// More precise regex to capture all input cases
		const match = userInput.match(/^(\w+)\s+(\d+)(?::(\d+))?(?:-(\d+)(?::(\d+))?)?$/);
		if (!match) {
			errorMessage =
				"Invalid input format. Use 'Book Chapter', 'Book Chapter:Verse', 'Book Chapter:Verse - Chapter:Verse', or 'Book Chapter - Chapter'.";
			return;
		}

		const [, bookName, startChapter, startVerse, endChapter = startChapter, endVerse = startVerse] =
			match;

		try {
			const book = await db.books.where({ name: bookName }).first();
			if (!book) {
				errorMessage = `Book not found: ${bookName}`;
				return;
			}

			// Query construction based on input type
			let query;
			if (startVerse) {
				if (endVerse) {
					if (startChapter !== endChapter) {
						// Multiple chapters, possibly with verse range in the last chapter
						query = db.verses.where('chapter_id').between(Number(startChapter), Number(endChapter));
					} else {
						// Single chapter, specific verse range
						query = db.verses
							.where({ chapter_id: Number(startChapter) })
							.and(
								(verse) => verse.number >= Number(startVerse) && verse.number <= Number(endVerse)
							);
					}
				} else {
					// Single verse
					query = db.verses.where({ chapter_id: Number(startChapter), number: Number(startVerse) });
				}
			} else {
				// Full chapters, possibly multiple
				query = db.verses.where('chapter_id').between(Number(startChapter), Number(endChapter));
			}

			versesOutput = await query.toArray();

			if (versesOutput.length === 0) {
				errorMessage = 'No verses found for the specified range.';
			}
		} catch (error) {
			console.error('Error fetching verses:', error);
			errorMessage = 'Failed to fetch verses due to an error.';
		}
	}
</script>

<div>
	<input type="text" bind:value={userInput} placeholder="e.g., Genesis 1:3-15" />
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
