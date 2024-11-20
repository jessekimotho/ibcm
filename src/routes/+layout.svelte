<script>
	import { onMount } from 'svelte';
	import '../app.css';
	import { fade } from 'svelte/transition';
	import Calendar from '../lib/layout/Calendar.svelte';
	import db from '$lib/js/db.js';
	import importBooks from '$lib/js/initDatabase';
	import importDevotion from '$lib/js/initDevotion';

	onMount(async () => {
		const devotion = await db.app_settings.get('devotion');

		if (!devotion || !devotion.value) {
			await db.app_settings.put({ id: 'devotion', value: 'initialized' });
			console.log('done');
			await importBooks();
			await importDevotion();
			console.log('Base Data is Imported');
			return true; // Indicates the field was just initialized
		}
		console.log('Base Data is Already Present. Not Imported');
		return false; // Indicates the field already had a value
	});
</script>

<div class="page-structure" transition:fade>
	<div class="navbar">
		<Calendar />

		<div class="button-group" transition:fade>
			<a class="button-complex" href="/pray">
				<div class="button-title">Pray</div>
				<div class="subtext">You haven't prayed today</div>
			</a>
			<a class="button-complex" href="/plan">
				<div class="button-title">Planner</div>
				<div class="subtext">You have no daily tasks coming up today</div>
			</a>
			<a class="button-complex" href="/readings">
				<div class="button-title">Readings</div>
				<div class="subtext">0/4 complete</div>
			</a>
			<a class="button-complex" href="/goals">
				<div class="button-title">Goals</div>
				<div class="subtext">You have 4 weekly goals lined up today</div>
			</a>
		</div>
	</div>
	<div class="window">
		<slot />
	</div>
</div>
