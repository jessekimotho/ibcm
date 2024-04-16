<script>
	import { onMount } from 'svelte';
	import db from '$lib/js/db.js';

	let books = [];
	let chapters = [];
	let verses = [];
	let selectedBookId;
	let selectedChapterId;
	let selectedVerseId;
	let verseText = '';

	onMount(async () => {
		books = await db.books.toArray(); // Load books directly from IndexedDB
	});

	async function loadChapters() {
		if (selectedBookId) {
			chapters = await db.chapters.where({ book_id: Number(selectedBookId) }).toArray();
			verses = []; // Clear verses when book changes
			verseText = ''; // Clear verse text when book changes
		}
	}

	async function loadVerses() {
		if (selectedChapterId) {
			verses = await db.verses.where({ chapter_id: Number(selectedChapterId) }).toArray();
			verseText = ''; // Clear verse text when chapter changes
		}
	}

	async function showVerseText() {
		if (selectedVerseId) {
			const verse = await db.verses.get(Number(selectedVerseId));
			verseText = verse ? verse.text : ''; // Show the text of the selected verse
		}
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
