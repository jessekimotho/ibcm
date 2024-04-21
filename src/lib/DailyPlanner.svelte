<script>
	import db from '$lib/js/db.js';
	export let date = new Date().toISOString().split('T')[0]; // Default to today's date
	let plannerEntries = [];

	async function loadPlannerEntries() {
		const entries = await db.planner_entries.where({ date }).toArray();
		hourEntries = hours.map((hour) => {
			const found = entries.find((e) => e.hour === hour);
			return found || { hour, event: '', id: undefined };
		});
	}

	async function saveEntry(hourEntry) {
		await db.planner_entries.put({
			id: hourEntry.id,
			date,
			hour: hourEntry.hour,
			event: hourEntry.event
		});
		loadPlannerEntries();
	}

	$: date, loadPlannerEntries();

	let hours = Array.from({ length: 10 }, (_, i) => `${8 + i}am`); // Adjust according to your needs
	let hourEntries = [];
</script>

{#each hourEntries as hourEntry (hourEntry.hour)}
	<div>
		<input
			type="text"
			placeholder={`${hourEntry.hour} event`}
			bind:value={hourEntry.event}
			on:blur={() => saveEntry(hourEntry)}
		/>
	</div>
{/each}
