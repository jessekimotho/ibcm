<script>
	import db from '$lib/js/db.js';
	import { slide } from 'svelte/transition';
	import { onMount } from 'svelte';

	export let prayer;

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
		// Update the prayer object with the new details
		prayer.request = updatedRequest;
		prayer.category = updatedCategory;
		// Save the updated prayer to the Dexie database
		await db.prayers.put(prayer);
		// Exit editing mode
		isEditing = false;
	}

	async function markAsAnswered() {
		prayer.isAnswered = true;
		prayer.dateAnswered = new Date().toISOString();
		await db.prayers.put(prayer);
	}

	async function markAsUnanswered() {
		prayer.isAnswered = false;
		prayer.dateAnswered = null;
		await db.prayers.put(prayer);
	}

	async function deletePrayer() {
		await db.prayers.delete(prayer.id);
		isDeleted = true; // Mark this component for removal
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
				{#if prayer.isAnswered}
					<button class="action" on:click={markAsUnanswered}>Mark as Unanswered</button>
				{:else}
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
	.actual-request {
		margin-top: 8px;
		margin-bottom: 6px;
	}

	.category {
		font-size: 13px;
		font-weight: 600;
	}

	.prayer-actions {
		display: flex;
		gap: 8px;
		margin-top: 12px;
	}

	.prayer-dates {
		opacity: 0.6;
	}

	button.action {
		color: white;
		background: #ffa5003b;
		padding: 6px 12px;
		border-radius: 8px;
		border: none;
		cursor: pointer;
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
</style>
