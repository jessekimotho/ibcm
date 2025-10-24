<script>
	import { onMount } from 'svelte';
	import { dndzone } from 'svelte-dnd-action';
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

	// FIX: Reverting to traditional Svelte reactivity (let keyword)
	let groupedPrayers = {};
	let openMain = {};
	let openSub = {};
	let addingNew = {};
	let newPrayerText = {};

	// Load prayers from the database and group them by subcategory, sorted by order.
	async function loadPrayers() {
		const prayerRequests = await db.prayers.toArray();
		const newGroupedPrayers = {};
		mainGroups.forEach((group) => {
			group.subcategories.forEach((sub) => {
				newGroupedPrayers[sub] = prayerRequests
					.filter((prayer) => prayer.category === sub)
					.sort((a, b) => (a.order || 0) - (b.order || 0));
			});
		});
		// FIX: Reassign the variable to trigger reactivity
		groupedPrayers = newGroupedPrayers;
	}

	onMount(() => {
		// Initialize accordion open states (all closed by default)
		mainGroups.forEach((group) => (openMain[group.label] = false));
		// FIX: Reassigning objects to ensure initial reactivity is setup
		openMain = openMain;

		mainGroups
			.flatMap((group) => group.subcategories)
			.forEach((sub) => {
				openSub[sub] = false;
				addingNew[sub] = false;
				newPrayerText[sub] = '';
			});

		openSub = openSub;
		addingNew = addingNew;
		newPrayerText = newPrayerText;

		loadPrayers();
	});

	// Handle drag-and-drop reordering within each subcategory.
	async function handleDnd({ detail }, subCategory) {
		const newItems = detail.items;

		await Promise.all(
			newItems.map((prayer, index) => {
				prayer.order = index;
				return db.prayers.put(prayer);
			})
		);

		// FIX: Reassign the specific array within the object to trigger reactivity
		groupedPrayers[subCategory] = newItems;
		groupedPrayers = groupedPrayers; // Necessary if you want the array assignment to work reliably on the object
	}

	/**
	 * Handles manual movement (up/down arrows) of a prayer request.
	 */
	async function handleMove(event, subCategory) {
		const { id, direction } = event.detail;
		const items = groupedPrayers[subCategory];
		const oldIndex = items.findIndex((p) => p.id === id);

		if (oldIndex === -1) return;

		let newIndex = oldIndex;
		if (direction === 'up') {
			newIndex = Math.max(0, oldIndex - 1);
		} else if (direction === 'down') {
			newIndex = Math.min(items.length - 1, oldIndex + 1);
		}

		if (oldIndex === newIndex) {
			return;
		}

		// 1. Swap the elements in the local array
		// Use a temporary array to ensure we don't modify the state directly before the swap
		const tempItems = [...items];
		const [movedItem] = tempItems.splice(oldIndex, 1);
		tempItems.splice(newIndex, 0, movedItem);

		// 2. Update the 'order' field for *all* items in the subcategory
		const updates = tempItems.map((prayer, index) => {
			prayer.order = index;
			return db.prayers.put(prayer);
		});

		// 3. Commit the order changes to the database
		await Promise.all(updates);

		// 4. FIX: Reassign the array and the main object for UI update
		groupedPrayers[subCategory] = tempItems;
		groupedPrayers = groupedPrayers;
	}

	// Add a new prayer for the given subcategory.
	async function addNewPrayer(sub) {
		if (newPrayerText[sub] && newPrayerText[sub].trim().length > 0) {
			const currentPrayers = groupedPrayers[sub] || [];
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

			// FIX: Reassign the array and the main object for UI update
			groupedPrayers[sub] = [...currentPrayers, newPrayer];
			groupedPrayers = groupedPrayers;

			newPrayerText[sub] = '';
			newPrayerText = newPrayerText; // Reassign to clear input
			addingNew[sub] = false;
			addingNew = addingNew; // Reassign to hide form
		}
	}

	function cancelAdd(sub) {
		newPrayerText[sub] = '';
		newPrayerText = newPrayerText; // Reassign to clear input
		addingNew[sub] = false;
		addingNew = addingNew; // Reassign to hide form
	}
</script>

<main>
	{#each mainGroups as group}
		<div class="accordion main">
			<div class="accordion-header main-header">
				<button
					on:click={() => ((openMain[group.label] = !openMain[group.label]), (openMain = openMain))}
					aria-expanded={openMain[group.label]}
					aria-controls="{group.label}-content"
				>
					{group.label}
				</button>
			</div>
			{#if openMain[group.label]}
				<div class="accordion-content" id="{group.label}-content">
					{#each group.subcategories as sub}
						<div class="accordion sub">
							<div class="accordion-header sub-header">
								<button
									on:click={() => ((openSub[sub] = !openSub[sub]), (openSub = openSub))}
									aria-expanded={openSub[sub]}
									aria-controls="{sub}-content"
								>
									{sub} ({groupedPrayers[sub] ? groupedPrayers[sub].length : 0})
								</button>
							</div>
							{#if openSub[sub]}
								<div
									class="accordion-content prayer-list"
									id="{sub}-content"
									use:dndzone={{ items: groupedPrayers[sub], flipDurationMs: 150, type: sub }}
									on:consider={(e) => handleDnd(e, sub)}
									on:finalize={(e) => handleDnd(e, sub)}
								>
									{#if groupedPrayers[sub] && groupedPrayers[sub].length > 0}
										{#each groupedPrayers[sub] as prayer (prayer.id)}
											<Request {prayer} on:move={(e) => handleMove(e, sub)} />
										{/each}
									{:else}
										<div class="empty">No prayer requests in this category.</div>
									{/if}

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
												addingNew = addingNew; // Reassign to show form
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
	main {
		color: white;
	}
	.accordion.main {
		margin: 16px 0;
		border-radius: 8px;
	}

	.main-header {
		background-color: #444;
		color: #fff;
		border-radius: 8px;
		overflow: hidden;
	}
	.main-header button {
		background-color: transparent;
		color: #fff;
		padding: 16px;
		cursor: pointer;
		border: none;
		width: 100%;
		text-align: left;
		font-size: inherit;
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
		border-radius: 6px;
		overflow: hidden;
	}
	.sub-header button {
		background-color: transparent;
		color: #fff;
		padding: 12px;
		cursor: pointer;
		border: none;
		width: 100%;
		text-align: left;
		font-size: inherit;
	}

	/* The container that holds the Request components and has dndzone applied */
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
