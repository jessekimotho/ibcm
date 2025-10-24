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
				'Thanksgiving', // Target category for answered prayers in this group
				'Scripture Reading',
				'Meditation',
				'Listening - Yielding',
				'Songs of Praise'
			]
		}
	];

	// Standard Svelte reactivity model (Svelte 4/5)
	let groupedPrayers = {};
	let openMain = {};
	let openSub = {};
	let addingNew = {};
	let newPrayerText = {};

	// --- NEW LOGIC: Determine the destination category based on the old category's parent group ---
	/**
	 * Determines the correct destination category ('Praise' or 'Thanksgiving')
	 * based on which main group the prayer's current category belongs to.
	 * @param {string} oldCategory
	 * @returns {string} The name of the destination category.
	 */
	function getDestinationCategory(oldCategory) {
		for (const group of mainGroups) {
			if (group.subcategories.includes(oldCategory)) {
				if (group.label === 'PRAY') {
					// All categories under 'PRAY' move to 'Praise'
					return 'Praise';
				} else if (group.label === 'Hour that changes the world') {
					// All categories under 'Hour that changes the world' move to 'Thanksgiving'
					return 'Thanksgiving';
				}
			}
		}
		// Fallback, though ideally, all categories are covered
		return 'Thanksgiving';
	}
	// ---------------------------------------------------------------------------------------------

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
		groupedPrayers = newGroupedPrayers;
	}

	onMount(() => {
		// Initialize accordion open states (all closed by default)
		mainGroups.forEach((group) => (openMain[group.label] = false));
		openMain = openMain; // Trigger reactivity for initial state

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

		groupedPrayers[subCategory] = newItems;
		groupedPrayers = groupedPrayers;
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

		const tempItems = [...items];
		const [movedItem] = tempItems.splice(oldIndex, 1);
		tempItems.splice(newIndex, 0, movedItem);

		const updates = tempItems.map((prayer, index) => {
			prayer.order = index;
			return db.prayers.put(prayer);
		});
		await Promise.all(updates);

		groupedPrayers[subCategory] = tempItems;
		groupedPrayers = groupedPrayers;
	}

	/**
	 * HANDLES PRAYER MARKED AS ANSWERED (moves to group-specific target).
	 */
	async function handleAnswered(event) {
		const { id, oldCategory } = event.detail; // Only need id and oldCategory

		// --- NEW: Calculate the destination based on the old category's parent group ---
		const newCategory = getDestinationCategory(oldCategory);

		// 1. If already at the destination, do nothing (or just refresh)
		if (oldCategory === newCategory) {
			groupedPrayers = groupedPrayers;
			return;
		}

		// 2. Find the item and remove it from the old list
		const oldItems = groupedPrayers[oldCategory] || [];
		const itemIndex = oldItems.findIndex((p) => p.id === id);
		if (itemIndex === -1) return;

		const [movedItem] = oldItems.splice(itemIndex, 1);
		groupedPrayers[oldCategory] = oldItems; // Remove from old list UI

		// 3. Update category, calculate new order, and save to database
		movedItem.category = newCategory;
		const newItems = groupedPrayers[newCategory] || [];
		movedItem.order = newItems.length > 0 ? Math.max(...newItems.map((p) => p.order || 0)) + 1 : 0;
		await db.prayers.put(movedItem);

		// 4. Add to the new list and update the UI
		groupedPrayers[newCategory] = [...newItems, movedItem];
		groupedPrayers = groupedPrayers;
	}

	/**
	 * HANDLES PRAYER MARKED AS UNANSWERED (moves back to 'Ask').
	 * Note: For simplicity, all unmarked prayers go to 'Ask', regardless of group.
	 */
	async function handleUnanswered(event) {
		const { id, oldCategory } = event.detail;
		const newCategory = 'Ask'; // Target for all unmarked prayers

		// 1. Find the item and remove it from the old list
		const oldItems = groupedPrayers[oldCategory] || [];
		const itemIndex = oldItems.findIndex((p) => p.id === id);
		if (itemIndex === -1) return;

		const [movedItem] = oldItems.splice(itemIndex, 1);
		groupedPrayers[oldCategory] = oldItems; // Remove from old list UI

		// 2. Update category, calculate new order, and save to database
		movedItem.category = newCategory;
		const newItems = groupedPrayers[newCategory] || [];
		movedItem.order = newItems.length > 0 ? Math.max(...newItems.map((p) => p.order || 0)) + 1 : 0;
		await db.prayers.put(movedItem);

		// 3. Add to the new list and update the UI
		groupedPrayers[newCategory] = [...newItems, movedItem];
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

			groupedPrayers[sub] = [...currentPrayers, newPrayer];
			groupedPrayers = groupedPrayers;

			newPrayerText[sub] = '';
			newPrayerText = newPrayerText;
			addingNew[sub] = false;
			addingNew = addingNew;
		}
	}

	function cancelAdd(sub) {
		newPrayerText[sub] = '';
		newPrayerText = newPrayerText;
		addingNew[sub] = false;
		addingNew = addingNew;
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
											<Request
												{prayer}
												on:move={(e) => handleMove(e, sub)}
												on:answered={(e) => handleAnswered(e)}
												on:unanswered={(e) => handleUnanswered(e)}
											/>
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
												addingNew = addingNew;
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

	/* A11y & Styling for Main Header */
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

	/* A11y & Styling for Sub Header */
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
