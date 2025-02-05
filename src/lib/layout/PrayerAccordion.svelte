<script>
	import { onMount } from 'svelte';
	import db from '$lib/js/db.js';
	import Request from '$lib/layout/Request.svelte';

	// Define the two main groups with their subcategories
	const mainGroups = [
		{
			label: 'PRAY',
			subcategories: ['Praise', 'Repent', 'Ask', 'Yield']
		},
		{
			label: 'Hour that changes the world',
			subcategories: [
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
			]
		}
	];

	// Object to store prayer requests grouped by subcategory
	let groupedPrayers = {};

	// Track open states for main groups and subcategories
	let openMain = {};
	let openSub = {};

	// Track whether we are adding a new prayer for a given subcategory
	let addingNew = {};
	// Hold temporary new prayer text for each subcategory
	let newPrayerText = {};

	// Load prayers from the database and group them by subcategory, sorted by order.
	async function loadPrayers() {
		const prayerRequests = await db.prayers.toArray();
		mainGroups.forEach((group) => {
			group.subcategories.forEach((sub) => {
				groupedPrayers[sub] = prayerRequests
					.filter((prayer) => prayer.category === sub)
					.sort((a, b) => (a.order || 0) - (b.order || 0));
			});
		});
	}

	onMount(() => {
		// Initialize accordion open states (all closed by default)
		mainGroups.forEach((group) => (openMain[group.label] = false));
		mainGroups
			.flatMap((group) => group.subcategories)
			.forEach((sub) => {
				openSub[sub] = false;
				addingNew[sub] = false;
				newPrayerText[sub] = '';
			});
		loadPrayers();
	});

	// Add a new prayer for the given subcategory.
	async function addNewPrayer(sub) {
		if (newPrayerText[sub] && newPrayerText[sub].trim().length > 0) {
			const currentPrayers = groupedPrayers[sub] || [];
			// Set order to last order + 1 (or 0 if empty)
			const newOrder =
				currentPrayers.length > 0 ? Math.max(...currentPrayers.map((p) => p.order || 0)) + 1 : 0;
			let newPrayer = {
				category: sub,
				request: newPrayerText[sub],
				dateCreated: new Date().toISOString(),
				dateAnswered: null,
				isAnswered: false,
				order: newOrder
			};
			const id = await db.prayers.add(newPrayer);
			newPrayer.id = id;
			groupedPrayers[sub] = [...currentPrayers, newPrayer];
			newPrayerText[sub] = '';
			addingNew[sub] = false;
		}
	}

	function cancelAdd(sub) {
		newPrayerText[sub] = '';
		addingNew[sub] = false;
	}
</script>

<main>
	{#each mainGroups as group}
		<div class="accordion main">
			<div
				class="accordion-header main-header"
				on:click={() => (openMain[group.label] = !openMain[group.label])}
			>
				{group.label}
			</div>
			{#if openMain[group.label]}
				<div class="accordion-content">
					{#each group.subcategories as sub}
						<div class="accordion sub">
							<div
								class="accordion-header sub-header"
								on:click={() => (openSub[sub] = !openSub[sub])}
							>
								{sub} ({groupedPrayers[sub] ? groupedPrayers[sub].length : 0})
							</div>
							{#if openSub[sub]}
								<div
									class="accordion-content prayer-list"
									use:dndzone={{
										items: groupedPrayers[sub] || [],
										flipDurationMs: 300,
										dragHandle: '.drag-handle' // Optional: require drag handle
									}}
								>
									{#if groupedPrayers[sub] && groupedPrayers[sub].length > 0}
										{#each groupedPrayers[sub] as prayer (prayer.id)}
											<!-- Include a drag handle inside each Request if needed -->
											<Request {prayer} />
										{/each}
									{:else}
										<div class="empty">No prayer requests in this category.</div>
									{/if}

									<!-- "Add New" button or inline add form -->
									{#if addingNew[sub]}
										<div class="new-prayer">
											<textarea
												bind:value={newPrayerText[sub]}
												placeholder="Enter new prayer request"
											></textarea>
											<div class="new-prayer-actions">
												<button on:click={() => addNewPrayer(sub)}>Add</button>
												<button on:click={() => cancelAdd(sub)}>Cancel</button>
											</div>
										</div>
									{:else}
										<button
											class="add-new-btn"
											on:click={() => {
												addingNew[sub] = true;
												newPrayerText[sub] = '';
											}}
										>
											Add New
										</button>
									{/if}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</main>

<style>
	/* Main accordion styling */
	.accordion.main {
		margin: 16px 0;
		border-radius: 8px;
	}
	.main-header {
		background-color: #444;
		color: #fff;
		padding: 16px;
		cursor: pointer;
	}
	.accordion-content {
		padding: 8px 16px;
		background-color: #222;
	}
	/* Sub accordion styling */
	.accordion.sub {
		margin: 8px 0;
		border: 1px solid #666;
		border-radius: 6px;
	}
	.sub-header {
		background-color: #555;
		color: #fff;
		padding: 12px;
		cursor: pointer;
	}
	.prayer-list {
		padding: 8px;
		background-color: #333;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.empty {
		padding: 8px;
		font-style: italic;
		color: #aaa;
	}
	/* Styling for the "Add New" button and inline add form */
	.add-new-btn {
		background: #ffa5008a;
		color: white;
		padding: 8px;
		border-radius: 8px;
		border: none;
		cursor: pointer;
	}
	.new-prayer {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 8px;
		background: #444;
		border-radius: 8px;
	}
	.new-prayer textarea {
		width: 100%;
		padding: 8px;
		border-radius: 8px;
		background: #ffffff14;
		color: white;
	}
	.new-prayer-actions {
		display: flex;
		gap: 8px;
	}
	.new-prayer-actions button {
		padding: 6px 12px;
		border: none;
		border-radius: 8px;
		cursor: pointer;
	}
	.new-prayer-actions button:first-child {
		background: #00b894;
		color: white;
	}
	.new-prayer-actions button:last-child {
		background: #d63031;
		color: white;
	}
</style>
