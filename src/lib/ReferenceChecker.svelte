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

	async function processPassage(passage) {
		try {
			const result = await classifyAndFetch(passage);

			if (result.errorMessage) {
				errorMessage = result.errorMessage;
				chaptersOutput = [];
			} else {
				errorMessage = '';
				chaptersOutput = Array.isArray(result.chaptersOutput) ? result.chaptersOutput : [];
				classification = result.classification;
			}
		} catch (error) {
			console.error('Error in classifyAndFetch:', error);
			errorMessage = 'An error occurred while fetching data.';
			chaptersOutput = []; // Fallback to an empty array
		}
	}
</script>

<div class="bible-reference">
	<!-- <p>Classification: {classification}</p> -->
	{#if errorMessage}
		<p class="error">{errorMessage}</p>
	{/if}
	{#if Array.isArray(chaptersOutput) && chaptersOutput.length > 0}
		{#each chaptersOutput as chapter}
			<h3>Chapter {chapter.chapterNumber}</h3>
			<ol start={chapter.verses[0]?.verseNumber}>
				{#each chapter.verses as verse}
					<li>{verse.text}</li>
				{/each}
			</ol>
		{/each}
	{:else}
		<p>No chapters available.</p>
	{/if}
</div>

<style>
	.bible-reference {
		overflow: auto;
		display: flex;
		flex-direction: column;
		padding: 32px;
		padding-top: 12px;
	}
	ol {
		padding-left: 24px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	li {
		padding-left: 16px;
		line-height: 1.4;
	}
	h3 {
		font-size: 16px;
		text-align: center;
	}
</style>
