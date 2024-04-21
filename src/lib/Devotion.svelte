<script>
	import { onMount } from 'svelte';
	import { selectedPassage } from '$lib/js/store.js'; // Store import
	import db from '$lib/js/db.js'; // DB import
	import { writable } from 'svelte/store';

	let selectedDate = new Date();
	let dateString = formatDateString(selectedDate); // Initialize dateString from selectedDate
	let devotionDetails = null;

	// Initialize a local writable store for input binding
	let passageInput = writable('');

	// Subscribe to selectedPassage to update the input field whenever it changes externally
	selectedPassage.subscribe((value) => {
		passageInput.set(value);
	});

	function formatDateString(date) {
		return date.toISOString().split('T')[0]; // Formats the date to "yyyy-MM-dd"
	}

	async function loadDevotion() {
		devotionDetails = await db.daily_entries.where('date').equals(dateString).first();
	}

	onMount(loadDevotion);

	async function changeDate(event) {
		selectedDate = new Date(event.target.value);
		dateString = formatDateString(selectedDate); // Update dateString whenever selectedDate changes
		await loadDevotion();
	}

	function selectPassage(passage) {
		selectedPassage.set(passage);
	}

	// Update the store when the input field changes
	function handleInputChange(event) {
		selectedPassage.set(event.target.value);
	}
</script>

<div>
	<label for="datePicker">Select a date:</label>
	<input type="date" id="datePicker" bind:value={dateString} on:change={changeDate} />

	<!-- Input field for editing or entering passage directly -->
	<label for="passageInput">Edit Passage:</label>
	<input type="text" id="passageInput" bind:value={$passageInput} on:input={handleInputChange} />

	{#if devotionDetails}
		<div>
			<p>Date: {devotionDetails.date}</p>
			<button on:click={() => selectPassage(devotionDetails.prayer_passage)}
				>Prayer Passage: {devotionDetails.prayer_passage}</button
			>
			<button on:click={() => selectPassage(devotionDetails.y1p1)}
				>Year 1 Passage 1: {devotionDetails.y1p1}</button
			>
			<button on:click={() => selectPassage(devotionDetails.y1p2)}
				>Year 1 Passage 2: {devotionDetails.y1p2}</button
			>
			<button on:click={() => selectPassage(devotionDetails.y1p3)}
				>Year 1 Passage 3: {devotionDetails.y1p3}</button
			>
			<button on:click={() => selectPassage(devotionDetails.y1p4)}
				>Year 1 Passage 4: {devotionDetails.y1p4}</button
			>
			<button on:click={() => selectPassage(devotionDetails.y2p1)}
				>Year 2 Passage 1: {devotionDetails.y2p1}</button
			>
			<button on:click={() => selectPassage(devotionDetails.y2p2)}
				>Year 2 Passage 2: {devotionDetails.y2p2}</button
			>
			<!-- Additional buttons can be added as needed -->
		</div>
	{:else}
		<p>No devotion details found for the selected date.</p>
	{/if}
</div>
