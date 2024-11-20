<script>
	import { classifyAndFetch } from '$lib/js/methods.js';
	import { selectedPassage } from '$lib/js/store.js';

	let chaptersOutput = [];
	let errorMessage = '';
	let classification = '';

	// Reactive statement triggers a normal function call
	$: {
		if ($selectedPassage && $selectedPassage.trim().length > 0) {
			processPassage($selectedPassage);
		}
	}

	// Separate async function to handle the fetch operation
	async function processPassage(passage) {
		try {
			const result = await classifyAndFetch(passage);

			if (result.errorMessage) {
				errorMessage = result.errorMessage;
				chaptersOutput = [];
			} else {
				errorMessage = '';
				chaptersOutput = result.chaptersOutput;
				classification = result.classification;
			}
		} catch (error) {
			console.error('Error in classifyAndFetch:', error);
			errorMessage = 'An error occurred while fetching data.';
		}
	}
</script>

<div>
	<!-- <p>Classification: {classification}</p> -->
	{#if errorMessage}
		<p class="error">{errorMessage}</p>
	{/if}
	{#each chaptersOutput as chapter}
		<h3>Chapter {chapter.chapterNumber}</h3>
		<ol start={chapter.verses[0]?.verseNumber}>
			{#each chapter.verses as verse}
				<li>{verse.text}</li>
			{/each}
		</ol>
	{/each}
</div>

<style>
	ol {
		padding-left: 12px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	li {
		padding-left: 16px;
		line-height: 1.4;
	}
</style>
