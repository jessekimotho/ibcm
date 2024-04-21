<script>
	import { createEventDispatcher } from 'svelte';

	let selectedDate = new Date();
	let dateString = selectedDate.toISOString().split('T')[0];
	const dispatch = createEventDispatcher();

	function changeDate(event) {
		selectedDate = new Date(event.target.value);
		dateString = selectedDate.toISOString().split('T')[0];
		dispatch('dateChange', { date: dateString });
	}
</script>

<div>
	<label for="datePicker">Select a date:</label>
	<input type="date" id="datePicker" bind:value={dateString} on:change={changeDate} />
</div>
