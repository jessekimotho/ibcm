<script>
	import importBooks from '$lib/js/initDatabase';
	import BibleSelector from '$lib/BibleSelector.svelte';
	import BibleRangeSelector from '$lib/BibleRangeSelector.svelte';

	let importing = false;

	async function handleImport() {
		importing = true;
		await importBooks();
		importing = false;
		alert('Import completed!');
	}
</script>

<button on:click={handleImport} disabled={importing}>
	{importing ? 'Importing...' : 'Import Bible Data'}
</button>

<BibleSelector />
<BibleRangeSelector />
