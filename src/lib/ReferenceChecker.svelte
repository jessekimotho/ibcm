<script>
	import { onMount } from 'svelte';
	import db from '$lib/js/db.js';

	let userInput = '';
	let chaptersOutput = []; // This will hold chapters and their verses
	let errorMessage = '';
	let classification = '';

	// Fetching chapters and verses based on different classifications
	async function fetchSingleChapter(bookName, chapterNumber) {
		const book = await db.books.where('bookName').equals(bookName).first();
		if (!book) {
			errorMessage = `Book not found: ${bookName}`;
			return;
		}

		const chapter = await db.chapters
			.where({ bookName: bookName, chapterNumber: chapterNumber })
			.first();
		if (!chapter) {
			errorMessage = `Chapter not found: ${chapterNumber} in ${bookName}`;
			return;
		}

		const verses = await db.verses
			.where({ bookName: bookName, chapterNumber: chapterNumber })
			.toArray();

		chaptersOutput.push({
			chapterNumber: chapterNumber,
			verses: verses
		});

		chaptersOutput = chaptersOutput;
	}

	async function fetchSingleVerse(bookName, chapterNumber, verseNumber) {
		const chapter = await db.chapters.get({ bookName: bookName, chapterNumber: chapterNumber });
		if (!chapter) {
			errorMessage = `Chapter not found: ${chapterNumber} in ${bookName}`;
			return;
		}

		const verse = await db.verses.get({
			bookName: bookName,
			chapterNumber: chapterNumber,
			verseNumber: verseNumber
		});
		if (!verse) {
			errorMessage = `Verse not found: ${verseNumber} in chapter ${chapterNumber} of ${bookName}`;
			return;
		}

		chaptersOutput.push({
			chapterNumber: chapter.chapterNumber,
			verses: [verse]
		});

		chaptersOutput = chaptersOutput;
	}

	async function fetchVerseRange(bookName, chapterNumber, startVerse, endVerse) {
		const verses = await db.verses
			.where('[bookName+chapterNumber+verseNumber]')
			.between(
				[bookName, chapterNumber, startVerse],
				[bookName, chapterNumber, endVerse],
				true,
				true
			)
			.toArray();

		if (verses.length === 0) {
			errorMessage = `No verses found from verse ${startVerse} to ${endVerse} in chapter ${chapterNumber} of ${bookName}`;
			return;
		}

		chaptersOutput.push({
			chapterNumber: chapterNumber,
			verses: verses
		});

		chaptersOutput = chaptersOutput;
	}

	async function fetchChapterRange(bookName, startChapter, endChapter) {
		const chapters = await db.chapters
			.where('[bookName+chapterNumber]')
			.between([bookName, startChapter], [bookName, endChapter], true, true)
			.toArray();

		if (chapters.length === 0) {
			errorMessage = `No chapters found from ${startChapter} to ${endChapter} in ${bookName}`;
			return;
		}

		for (const chapter of chapters) {
			const verses = await db.verses
				.where('[bookName+chapterNumber]')
				.equals([bookName, chapter.chapterNumber])
				.toArray();
			chaptersOutput.push({
				chapterNumber: chapter.chapterNumber,
				verses: verses
			});

			chaptersOutput = chaptersOutput;
		}
	}

	function classifyAndFetch() {
		const trimmedInput = userInput.trim();
		const formattedInput = capitalizeInput(trimmedInput);
		errorMessage = '';
		chaptersOutput = [];
		classification = '';

		if (/^[\w\s]+\s\d+$/.test(formattedInput)) {
			const [bookName, chapterNumber] = formattedInput.split(' ');
			fetchSingleChapter(bookName, parseInt(chapterNumber));
			classification = 'Single Chapter';
		} else if (/^[\w\s]+\s\d+:\d+$/.test(formattedInput)) {
			const [bookName, chapterVerse] = formattedInput.split(' ');
			const [chapterNumber, verseNumber] = chapterVerse.split(':');
			fetchSingleVerse(bookName, parseInt(chapterNumber), parseInt(verseNumber));
			classification = 'Single Verse';
		} else if (/^[\w\s]+\s\d+:\d+-\d+$/.test(formattedInput)) {
			const [bookName, chapterVerseRange] = formattedInput.split(' ');
			const [chapterNumber, verseRange] = chapterVerseRange.split(':');
			const [startVerse, endVerse] = verseRange.split('-');
			fetchVerseRange(bookName, parseInt(chapterNumber), parseInt(startVerse), parseInt(endVerse));
			classification = 'Verse Range';
		} else if (/^[\w\s]+\s\d+-\d+$/.test(trimmedInput)) {
			const [bookName, chapterRange] = formattedInput.split(' ');
			const [startChapter, endChapter] = chapterRange.split('-');
			fetchChapterRange(bookName, parseInt(startChapter), parseInt(endChapter));
			classification = 'Chapter Range';
		} else {
			errorMessage = 'Invalid input format. Please enter a valid format.';
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

	{#each chaptersOutput as chapter}
		<h3>Chapter {chapter.chapterNumber}</h3>
		<ol>
			{#each chapter.verses as verse}
				<li>{verse.text}</li>
			{/each}
		</ol>
	{/each}
</div>
