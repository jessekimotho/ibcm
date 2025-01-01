<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import db from '$lib/js/db.js';
	import { selectedDate } from '$lib/js/store.js';

	let date;
	let day, month, year;
	let loaded = false;

	$: date = $selectedDate;
	$: [day, month, year] = date.split('-').map(Number);

	// Predefined hours for the planner
	let hours = Array.from({ length: 10 }, (_, i) => {
		const hour = 8 + i;
		const period = hour >= 12 ? 'pm' : 'am';
		const displayHour = hour > 12 ? hour - 12 : hour;
		return `${displayHour}${period}`;
	});

	let hourEntries = [];

	// Load planner entries from the database
	async function loadPlannerEntries() {
		try {
			const entries = await db.planner_entries
				.where('[day+month+year]')
				.equals([day, month, year])
				.toArray();

			hourEntries = hours.map((hour) => {
				const found = entries.find((e) => e.hour === hour);
				return found || { hour, event: '', id: undefined };
			});
		} catch (error) {
			console.error('Error loading planner entries:', error);
		}
	}

	// Save or update an entry in the database
	async function saveEntry(hourEntry) {
		try {
			await db.planner_entries.put({
				id: hourEntry.id, // Use existing ID if it exists
				day,
				month,
				year,
				hour: hourEntry.hour,
				event: hourEntry.event
			});
			loadPlannerEntries(); // Reload entries after saving
		} catch (error) {
			console.error('Error saving planner entry:', error);
		}
	}

	// React to date changes and reload entries
	$: date, loadPlannerEntries();

	onMount(() => {
		loaded = true;
	});
</script>

{#if loaded}
	<div class="wraps">
		<div class="left-col glass" transition:fade>
			<div class="readings-selector">
				<div class="titling">Daily Planner</div>
				<div class="entries">
					{#each hourEntries as hourEntry (hourEntry.hour)}
						<div class="hour-entry">
							<div class="titles-hour">{hourEntry.hour}</div>
							<textarea
								type="text"
								placeholder={`${hourEntry.hour} event`}
								bind:value={hourEntry.event}
								on:input={() => saveEntry(hourEntry)}
							/>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.readings-selector {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.wraps {
		display: flex;
		flex: 1;
		width: 100%;
		height: 100%;
		gap: 32px;
	}

	.left-col {
		flex-direction: column;
		overflow: auto;
		flex: 1;
	}

	.glass {
		background: #0f0f0fad;
		backdrop-filter: blur(50px);
		border-radius: 16px;
		padding: 32px;
	}
	.left-col.glass {
		flex-direction: column;
	}

	.titling {
		font-size: 18px;
		font-weight: 600;
		margin-bottom: 24px;
	}
	textarea {
		color: white;
		resize: none;
		flex: 1;
	}
	::placeholder {
		color: rgba(255, 255, 255, 0.5);
	}

	.entries {
		display: flex;
		flex-wrap: wrap;
		flex: 1;
	}

	.hour-entry {
		min-width: 360px;
		min-height: 100px;
		flex: 1;
		padding-top: 16px;
		border-top: 1px solid #ffffff29;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
</style>
