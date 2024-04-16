<script>
	import importBooks from  '$lib/js/initDatabase'

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
