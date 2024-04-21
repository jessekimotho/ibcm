<script>
	import DateSelector from '$lib/DateSelector.svelte';
	import DevotionDetails from '$lib/DevotionDetails.svelte';

	let selectedDate = new Date().toISOString().split('T')[0]; // Default today's date
</script>

<DateSelector
	on:dateChange={(event) => {
		selectedDate = event.detail.date;
	}}
/>
<DevotionDetails date={selectedDate} />
