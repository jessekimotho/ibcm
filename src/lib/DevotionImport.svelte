<script>
	import importDevotion from '$lib/js/initDevotion';

	let importing = false;

	async function handleImport() {
		importing = true;
		await importDevotion();
		importing = false;
		alert('Import completed!');
	}
</script>

<button on:click={handleImport} disabled={importing}>
	{importing ? 'Importing...' : 'Import Devotion Data'}
</button>
