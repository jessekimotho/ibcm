<script>
	import { onMount } from 'svelte';
	import db from '$lib/js/db.js';
	import ReferenceChecker from '$lib/ReferenceChecker.svelte';
	import { selectedPassage } from '$lib/js/store.js';
	import DailyPlanner from './DailyPlanner.svelte'; // Adjust the path as necessary
	export let date;

	let devotionDetails = null;
	let error = null;

	async function loadDevotion() {
		try {
			let details = await db.daily_entries.where('date').equals(date).first();
			if (!details) {
				devotionDetails = {
					date,
					journal_entry: '',
					intention: '',
					revised_memory_verse: false,
					used_prayer_journal: false
				};
			} else {
				devotionDetails = { ...details };
			}
		} catch (err) {
			console.error('Failed to load devotion details:', err);
			error = err.message || 'Failed to load data';
		}
	}

	async function saveField(field, value) {
		try {
			await db.daily_entries.update(devotionDetails.id, { [field]: value });
			console.log(`${field} saved`);
		} catch (err) {
			console.error(`Failed to update ${field}:`, err);
			error = `Failed to update ${field}`;
		}
	}

	onMount(() => {
		loadDevotion();
	});

	$: date, loadDevotion(); // Load devotion when date changes
	$: if (devotionDetails) {
		devotionDetails.journal_entry && saveField('journal_entry', devotionDetails.journal_entry);
		devotionDetails.intention && saveField('intention', devotionDetails.intention);
	}
</script>

{#if error}
	<p class="error">{error}</p>
{:else if devotionDetails}
	<div>
		<p>Date: {devotionDetails.date}</p>
		{#each ['prayer_passage', 'y1p1', 'y1p2', 'y1p3', 'y1p4', 'y2p1', 'y2p2'] as passage}
			<button on:click={() => selectedPassage.set(devotionDetails[passage])}>
				{passage}: {devotionDetails[passage]}
			</button>
		{/each}

		<label for="journal">Today's Bible Reading Journal:</label>
		<textarea
			id="journal"
			bind:value={devotionDetails.journal_entry}
			placeholder="Write your thoughts on today's reading..."
		></textarea>

		<div>
			<label for="intention">I will...</label>
			<textarea
				id="intention"
				bind:value={devotionDetails.intention}
				placeholder="determine to do today..."
			></textarea>
		</div>

		<label>
			<input
				type="checkbox"
				bind:checked={devotionDetails.revised_memory_verse}
				on:change={() => saveField('revised_memory_verse', devotionDetails.revised_memory_verse)}
			/>
			Revised Memory Verse
		</label>
		<label>
			<input
				type="checkbox"
				bind:checked={devotionDetails.used_prayer_journal}
				on:change={() => saveField('used_prayer_journal', devotionDetails.used_prayer_journal)}
			/>
			Used Prayer Journal
		</label>
		<DailyPlanner {date} />
	</div>
{:else}
	<p>Loading devotion details or no details available.</p>
{/if}

<ReferenceChecker />
