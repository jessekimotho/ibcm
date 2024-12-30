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

<div class="app-wrap">
	<div class="dimension-controls">
		<div class="page-structure" transition:fade>
			<div class="navbar">
				<Calendar />

				<div class="button-group" transition:fade>
					<a class="button-complex" href="/">
						<div class="button-title">Home</div>
					</a>

					<a class="button-complex" href="/pray">
						<div class="button-title">Prayer Requests</div>
					</a>

					<a class="button-complex" href="/readings">
						<div class="button-title">Bible Readings</div>
					</a>
					<a class="button-complex" href="/plan">
						<div class="button-title">Daily Planner</div>
					</a>
					<!-- <a class="button-complex" href="/resources">
						<div class="button-title">Resources</div>
						<div class="subtext">Devotional Resources</div>
					</a> -->
					<a class="button-complex" href="/donate">
						<div class="button-title">Donate</div>
					</a>
				</div>
			</div>
			<div class="window">
				<slot />
			</div>
		</div>
	</div>
</div>

<style>
	.app-wrap {
		background: #00000030;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		width: 100%;
	}

	.page-structure {
		max-width: 1500px;
		height: 100%;
		margin: auto;
		display: flex;
		flex: 1;
		padding: 32px;
		gap: 32px;
	}

	.subtext {
		display: none;
	}
	.dimension-controls {
		display: flex;
		height: 100%;
		width: 100%;
		max-height: 1000px;
	}
</style>
