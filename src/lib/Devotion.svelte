<script>
	import { onMount } from 'svelte';
	import { selectedPassage } from '$lib/js/store.js'; // Import the store
	import db from '$lib/js/db.js';

	let selectedDate = new Date(); // Default selected date to today
	let devotionDetails = null;

	const loadDevotionDetails = async () => {
		// Convert selectedDate to a string in 'YYYY-MM-DD' format
		const dateString = selectedDate.toISOString().split('T')[0];

		// Query the database for the devotion details for the selected date
		devotionDetails = await db.daily_entries.where('date').equals(dateString).first();
	};

	onMount(loadDevotionDetails);

	// Function to handle date selection change
	const handleDateChange = async (event) => {
		selectedDate = new Date(event.target.value);
		await loadDevotionDetails();
	};

	// Function to handle click on a passage
	const handlePassageClick = (passage) => {
		// Update the store with the selected passage value
		selectedPassage.set(passage);
	};
</script>

<div>
	<label for="datePicker">Select a date:</label>
	<input type="date" id="datePicker" bind:value={selectedDate} on:change={handleDateChange} />

	{#if devotionDetails}
		<div>
			<p>Date: {devotionDetails.date}</p>
			<!-- Display other details as per your database schema -->
			<button on:click={() => handlePassageClick(devotionDetails.prayer_passage)}
				>Prayer Passage: {devotionDetails.prayer_passage}</button
			>
			<button on:click={() => handlePassageClick(devotionDetails.y1p1)}
				>Year 1 Passage 1: {devotionDetails.y1p1}</button
			>
			<button on:click={() => handlePassageClick(devotionDetails.y1p2)}
				>Year 1 Passage 2: {devotionDetails.y1p2}</button
			>
			<button on:click={() => handlePassageClick(devotionDetails.y1p3)}
				>Year 1 Passage 3: {devotionDetails.y1p3}</button
			>
			<button on:click={() => handlePassageClick(devotionDetails.y1p4)}
				>Year 1 Passage 4: {devotionDetails.y1p4}</button
			>
			<button on:click={() => handlePassageClick(devotionDetails.y2p1)}
				>Year 2 Passage 1: {devotionDetails.y2p1}</button
			>
			<button on:click={() => handlePassageClick(devotionDetails.y2p2)}
				>Year 2 Passage 2: {devotionDetails.y2p2}</button
			>
			<!-- Add more fields as needed -->
		</div>
	{:else}
		<p>No devotion details found for the selected date.</p>
	{/if}
</div>
