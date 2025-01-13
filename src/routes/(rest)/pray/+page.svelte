<script>
	import { onMount } from 'svelte';
	import db from '$lib/js/db.js';
	import { fade } from 'svelte/transition';
	import DialogVideo from '$lib/layout/DialogVideo.svelte';
	import HelpButton from '$lib/layout/HelpButton.svelte';
	import Request from '$lib/layout/Request.svelte';

	let loaded;
	let prayerRequests = [];
	let filteredRequests = [];
	let newPrayer = {
		category: '',
		request: '',
		dateCreated: new Date().toISOString(),
		dateAnswered: null,
		isAnswered: false
	};
	let selectedCategory = 'All'; // New variable to track selected category
	let categories = [
		'All', // Add "All" to the category list
		'Praise',
		'Repent',
		'Ask',
		'Yield',
		'Worship and Praise',
		'Waiting on the Lord',
		'Confession',
		'Spiritual Warfare',
		'Claiming Promises',
		'Intercession',
		'Petitions',
		'Thanksgiving',
		'Scripture Reading',
		'Meditation',
		'Listening - Yielding',
		'Songs of Praise'
	];
	let categoryCount = {}; // New object to store counts for each category

	async function loadPrayers() {
		prayerRequests = await db.prayers.toArray();
		// Calculate category counts
		categoryCount = categories.reduce((counts, category) => {
			counts[category] = prayerRequests.filter((prayer) => prayer.category === category).length;
			return counts;
		}, {});
		applyFilter();
	}

	function applyFilter() {
		// Filter based on the selected category
		if (selectedCategory === 'All') {
			filteredRequests = prayerRequests;
		} else {
			filteredRequests = prayerRequests.filter((prayer) => prayer.category === selectedCategory);
		}
	}

	async function addPrayer() {
		if (newPrayer.category && newPrayer.request) {
			await db.prayers.add({ ...newPrayer });
			newPrayer = {
				category: '',
				request: '',
				dateCreated: new Date().toISOString(),
				dateAnswered: null,
				isAnswered: false
			};
			loadPrayers();
		}
	}

	// Watch for changes in `selectedCategory`
	$: selectedCategory, applyFilter();

	onMount(() => {
		loadPrayers();
		loaded = true;
	});
</script>

{#if loaded}
	<div class="wraps">
		<div class="left-col glass" transition:fade>
			<div class="prayer-page">
				<div class="titles">
					<div class="titling">Prayer Requests</div>
					<div class="filter">
						<select id="category-filter" bind:value={selectedCategory}>
							{#each categories as category}
								<option value={category}>
									{category} ({categoryCount[category] || 0})
								</option>
							{/each}
						</select>
					</div>
				</div>

				<div class="prayers-list">
					{#if filteredRequests.length > 0}
						{#each filteredRequests as prayer (prayer.id)}
							<Request {prayer} />
						{/each}
					{:else}
						<p>No prayer requests found for the selected category</p>
					{/if}
				</div>
			</div>
		</div>
		<div class="right-col">
			<div class="new-pray right-w glass" transition:fade>
				<div class="titling new-titling">New Prayer Request</div>
				<div class="request-content">
					<select bind:value={newPrayer.category}>
						<option value="" disabled selected>Click here to select Prayer Forms</option>
						{#each categories.slice(1) as category}
							<!-- Exclude "All" -->
							<option value={category}>
								{category} ({categoryCount[category] || 0})
							</option>
						{/each}
					</select>
					<textarea
						bind:value={newPrayer.request}
						class="prayer-request-text"
						placeholder="Enter prayer request"
					></textarea>

					<button on:click={addPrayer} class="add-prayer">Add Prayer</button>
				</div>
			</div>
			<DialogVideo videoUrl="prayerjournal">
				<HelpButton slot="trigger" />
			</DialogVideo>
		</div>
	</div>
{/if}

<style>
	.new-titling {
		margin-bottom: 24px;
	}
	.filter select {
		width: auto;
		color: white;
		padding: 8px;
		border-radius: 8px;
		background: #ffffff14;
	}
	.titling {
		font-size: 18px;
		font-weight: 600;
	}
	.titles {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		align-items: center;
		gap: 48px;
		margin-bottom: 24px;
	}
	.wraps {
		display: flex;
		flex: 1;
		width: 100%;
		height: 100%;
		gap: 32px;
	}

	.glass {
		background: #0f0f0fad;
		backdrop-filter: blur(50px);
		border-radius: 16px;
		padding: 32px;
	}
	.left-col {
		flex-direction: column;
		overflow: auto;
		flex: 1;
	}

	.right-col {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: 24px;
		max-width: 380px;
		position: relative;
	}

	select {
		width: 100%;
		margin: 0px;
		color: white;
		padding: 12px;
		border-radius: 8px;
		background: #ffffff14;
	}

	.new-pray {
		display: flex;
		flex-direction: column;
		color: white;
		padding-bottom: 36px;
	}

	.add-prayer {
		background: #ffa5008a !important;
		color: white;
		padding: 12px;
		border-radius: 8px;
		margin-top: 8px;
	}

	.prayer-request-text {
		min-height: 80px;
		color: white;
		background: #ffffff14;
		border-radius: 8px;
		padding: 12px;
	}
	.request-content {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
</style>
