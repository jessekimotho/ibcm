<script>
	import { onMount } from 'svelte';
	import '../app.css';
	import { fade } from 'svelte/transition';
	import Calendar from '../lib/layout/Calendar.svelte';
	import db from '$lib/js/db.js';
	import importBooks from '$lib/js/initDatabase';
	import importDevotion from '$lib/js/initDevotion';

	let initMessage = 'Please wait...';

	onMount(async () => {
		const devotion = await db.app_settings.get('devotion');

		if (!devotion || !devotion.value) {
			state = 'first-time';
			await db.app_settings.put({ id: 'devotion', value: 'initialized' });
			console.log('done');
			initMessage = 'Preparing KJV Bible';
			await importBooks();
			await importDevotion();
			initMessage = 'Preparing Daily Devotion Data';
			console.log('Base Data is Imported');
			state = 'ready';
			return true; // Indicates the field was just initialized
		} else if (devotion && devotion.value) {
			state = 'ready';
			console.log('Base Data is Already Present. Not Imported');
			return false; // Indicates the field already had a value
		}
	});

	let state = 'not initialized';
</script>

{#if state === 'first-time'}
	<div class="initialize-wrapper">
		<div class="initialize">
			<div class="intro-sequence">
				<img src="/images/icons/web-app-manifest-512x512.png" class="home-icon" alt="" />
				<div class="titles">
					<div class="title-sub">
						<div class="title-app">Meeting with God</div>
						<div class="subtitile">A Daily Devotional Journal</div>
					</div>
					<div class="owner">by the Independent Baptist College of Ministry</div>
				</div>
			</div>
			<div class="init-info">
				<div class="loader">
					<div class="loading-bar-container">
						<div class="loading-bar"></div>
					</div>
				</div>
				<p class="init-message">
					{initMessage}
				</p>
			</div>
		</div>
	</div>
{:else if state === 'ready'}
	<div class="app-wrap" transition:fade>
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
{/if}

<style>
	.initialize-wrapper {
		padding: 48px;
		height: 100%;
		display: flex;
	}
	.initialize {
		background: #0f0f0fad;
		backdrop-filter: blur(50px);
		border-radius: 16px;
		padding: 56px;
		color: white;
		max-width: 500px;
		margin: auto;
	}

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
		min-width: 1400px;
		height: 100%;
		margin: auto;
		display: flex;
		flex: 1;
		padding: 32px;
		gap: 32px;
	}

	.dimension-controls {
		display: flex;
		height: 100%;
		width: 100%;
		max-height: 1000px;
	}

	.titles {
		display: flex;
		flex-direction: column;
		gap: 4px;
		/* align-items: center; */
		justify-content: center;
	}

	.title-app {
		font-size: 24px;
		font-weight: bold;
	}

	::placeholder {
		color: rgba(255, 255, 255, 0.5);
	}

	.owner {
		font-size: 12px;
		opacity: 0.7;
	}

	.subtitile {
		font-size: 16px;
	}

	.titles {
		display: flex;
		flex-direction: column;
		gap: 4px;
		/* align-items: center; */
		justify-content: center;
	}

	.title-app {
		font-size: 24px;
		font-weight: bold;
	}
	.intro-sequence {
		display: flex;
		flex-direction: column;
		gap: 32px;
		text-align: center;
		align-items: center;
	}

	.glass {
		background: #0f0f0fad;
		backdrop-filter: blur(50px);
		border-radius: 16px;
		padding: 32px;
	}
	::placeholder {
		color: rgba(255, 255, 255, 0.5);
	}

	.home-icon {
		width: 100px;
		animation: pulse 3s infinite ease-in-out;
	}

	.owner {
		font-size: 12px;
		opacity: 0.7;
	}

	.subtitile {
		font-size: 16px;
	}

	.loading-bar-container {
		position: relative;
		width: 100%;
		height: 4px;
		background-color: #dddddd5e;
		overflow: hidden;
		border-radius: 2px;
	}

	.loading-bar {
		position: absolute;
		width: 30%;
		height: 100%;
		background-color: #5cbeff;
		animation: slide 1.5s infinite ease-in-out;
		border-radius: 2px;
	}

	.init-message {
		margin-top: 24px;
		margin-bottom: -24px;
		text-align: center;
	}
	@keyframes slide {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(400%);
		}
	}
	@keyframes pulse {
		0% {
			filter: drop-shadow(0px 0px 10px hsl(0deg 0% 100% / 30%));
		}
		50% {
			filter: drop-shadow(0px 0px 20px hsl(0deg 0% 100% / 80%));
		}
		100% {
			filter: drop-shadow(0px 0px 10px hsl(0deg 0% 100% / 30%));
		}
	}
	.init-info {
		padding-top: 32px;
	}
</style>
