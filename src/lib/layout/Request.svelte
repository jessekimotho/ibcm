<script>
	import db from '$lib/js/db.js';
	import { slide } from 'svelte/transition';
	import { onMount, createEventDispatcher } from 'svelte';

	export let prayer;

	const dispatch = createEventDispatcher();
	// Define the target category constants
	const THANKSGIVING_CATEGORY = 'Thanksgiving';
	const UNANSWERED_CATEGORY = 'Ask';

	let loaded = false;
	let isDeleted = false;
	let isEditing = false;
	let updatedRequest = prayer.request;
	let updatedCategory = prayer.category;

	onMount(() => {
		loaded = true;
	});

	const categories = [
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

	async function saveChanges() {
		prayer.request = updatedRequest;
		prayer.category = updatedCategory;
		await db.prayers.put(prayer);
		isEditing = false;
	}

	async function markAsAnswered() {
		const oldCategory = prayer.category;
		prayer.isAnswered = true;
		prayer.dateAnswered = new Date().toISOString();

		dispatch('answered', {
			id: prayer.id,
			oldCategory: oldCategory,
			newCategory: THANKSGIVING_CATEGORY
		});

		await db.prayers.put(prayer);
	}

	async function markAsUnanswered() {
		const oldCategory = prayer.category;
		prayer.isAnswered = false;
		prayer.dateAnswered = null;

		dispatch('unanswered', {
			id: prayer.id,
			oldCategory: oldCategory,
			newCategory: UNANSWERED_CATEGORY
		});

		await db.prayers.put(prayer);
	}

	async function deletePrayer() {
		await db.prayers.delete(prayer.id);
		isDeleted = true;
	}

	function move(direction) {
		dispatch('move', {
			id: prayer.id,
			direction: direction
		});
	}
</script>

{#if !isDeleted && loaded}
	<div class="prayer-entry" transition:slide>
		<div class="prayer-details">
			{#if isEditing}
				<select bind:value={updatedCategory}>
					{#each categories as category}
						<option value={category}>{category}</option>
					{/each}
				</select>
				<textarea bind:value={updatedRequest} class="edit-request"></textarea>
			{:else}
				<span class="category">{prayer.category}</span>
				{#if prayer.isAnswered}
					<span class="answered-tag">Answered Prayer</span>
				{/if}
				<p class="actual-request">{prayer.request}</p>
			{/if}
			<div class="prayer-dates">
				<small>Created: {new Date(prayer.dateCreated).toLocaleDateString()}</small>
				{#if prayer.isAnswered}
					<small>Answered: {new Date(prayer.dateAnswered).toLocaleDateString()}</small>
				{/if}
			</div>
		</div>
		<div class="prayer-actions">
			{#if isEditing}
				<button class="action save" on:click={saveChanges}>Save</button>
				<button class="action cancel" on:click={() => (isEditing = false)}>Cancel</button>
			{:else}
				<div class="reorder-controls">
					<button class="arrow-action" on:click={() => move('up')} title="Move Up">▲</button>
					<button class="arrow-action" on:click={() => move('down')} title="Move Down">▼</button>
				</div>

				{#if !prayer.isAnswered}
					<button class="action" on:click={markAsAnswered}>Mark as Answered</button>
				{/if}

				<button class="action edit" on:click={() => (isEditing = true)}>Edit</button>
				<button class="action delete" on:click={deletePrayer}>Delete</button>
			{/if}
		</div>
	</div>
{/if}

<style>
	.edit-request {
		width: 100%;
		min-height: 60px;
		padding: 8px;
		border-radius: 8px;
		background: #ffffff14;
		color: white;
	}

	.prayer-entry {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 16px;
		border-radius: 12px;
		background: #ffffff17;
	}

	.prayer-details {
		/* Use flex to align category and tag on the same line if needed */
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		margin-bottom: 8px; /* Push the dates down */
	}

	.actual-request {
		/* Reset margin to position it cleanly after the tag/category */
		margin-top: 0;
		margin-bottom: 6px;
		flex-basis: 100%; /* Ensure the request text takes the full width below the tags */
		order: 10; /* Make sure it appears below the tags */
	}

	.category {
		font-size: 13px;
		font-weight: 600;
		margin-right: 10px;
		order: 1;
	}

	/* 👇 NEW: Styling for the Answered Tag */
	.answered-tag {
		display: inline-block;
		background-color: #00b894; /* Green color for answered */
		color: white;
		font-size: 11px;
		font-weight: bold;
		padding: 4px 8px;
		border-radius: 4px;
		margin-right: 10px;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		order: 2; /* Position after the category */
	}
	/* ------------------------------------ */

	.prayer-actions {
		display: flex;
		gap: 8px;
		margin-top: 12px;
		align-items: center;
		flex-wrap: wrap;
	}

	.prayer-dates {
		opacity: 0.6;
		flex-basis: 100%; /* Ensure dates take up full width */
		order: 20;
	}

	button.action {
		color: white;
		background: #ffa5003b;
		padding: 6px 12px;
		border-radius: 8px;
		border: none;
		cursor: pointer;
		flex-shrink: 0;
	}
	.save {
		background: #00b894;
	}
	.cancel {
		background: #d63031;
	}

	select {
		width: 100%;
		margin: 0;
		color: white;
		padding: 12px;
		border-radius: 8px;
		background: #ffffff14;
	}

	.reorder-controls {
		display: flex;
		gap: 4px;
		border-right: 1px solid #ffffff33;
		padding-right: 8px;
		margin-right: 4px;
	}

	button.arrow-action {
		background: #9c27b052;
		color: white;
		padding: 6px;
		border-radius: 4px;
		border: none;
		cursor: pointer;
		width: 25px;
		height: 25px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 12px;
		line-height: 1;
		transition: background 0.1s;
	}

	button.arrow-action:hover {
		background: #9c27b088;
	}
</style>
