<script>
	import { onMount } from 'svelte';
	let books = [];
	let chapters = [];
	let verses = [];
	let selectedBookId;
	let selectedChapterId;
	let selectedVerseId;
	let verseText = '';

	onMount(async () => {
		const resBooks = await fetch('/api/books');
		books = await resBooks.json();
	});

	async function loadChapters() {
		const resChapters = await fetch(`/api/chapters/${selectedBookId}`);
		chapters = await resChapters.json();
		verses = []; // Clear verses when book changes
		verseText = ''; // Clear verse text when book changes
	}

	async function loadVerses() {
		const resVerses = await fetch(`/api/verses/${selectedChapterId}`);
		verses = await resVerses.json();
		verseText = ''; // Clear verse text when chapter changes
	}

	async function showVerseText() {
		const resVerse = await fetch(`/api/verse/${selectedVerseId}`);
		const data = await resVerse.json();
		verseText = data.text;
	}
</script>

<div>
	<select bind:value={selectedBookId} on:change={loadChapters}>
		<option value="">Select a Book</option>
		{#each books as book}
			<option value={book.id}>{book.name}</option>
		{/each}
	</select>

	<select bind:value={selectedChapterId} on:change={loadVerses} disabled={!selectedBookId}>
		<option value="">Select a Chapter</option>
		{#each chapters as chapter}
			<option value={chapter.id}>{chapter.number}</option>
		{/each}
	</select>

	<select bind:value={selectedVerseId} on:change={showVerseText} disabled={!selectedChapterId}>
		<option value="">Select a Verse</option>
		{#each verses as verse}
			<option value={verse.id}>{verse.number}</option>
		{/each}
	</select>

	{#if verseText}
		<p>{verseText}</p>
	{:else}
		<p>Select a verse to see the text.</p>
	{/if}
</div>
