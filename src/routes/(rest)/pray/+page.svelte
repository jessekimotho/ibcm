<script>
	import { onMount } from 'svelte';
	import db from '$lib/js/db.js';
	import { fade } from 'svelte/transition';

	let loaded;
	let prayerRequests = [];
	let newPrayer = {
		category: '',
		request: '',
		dateCreated: new Date().toISOString(),
		dateAnswered: null,
		isAnswered: false
	};
	let categories = ['Adoration', 'Confession', 'Thanksgiving', 'Supplication'];

	async function loadPrayers() {
		prayerRequests = await db.prayers.toArray();
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

	async function markAsAnswered(prayer) {
		prayer.isAnswered = true;
		prayer.dateAnswered = new Date().toISOString();
		await db.prayers.put(prayer);
		loadPrayers();
	}

	async function deletePrayer(prayerId) {
		await db.prayers.delete(prayerId);
		loadPrayers();
	}

	onMount(() => {
		loadPrayers();
		loaded = true;
	});
</script>

{#if loaded}
	<div class="wraps">
		<div class="left-col glass" transition:fade>
			<div class="prayer-page">
				<div class="titling">Prayer Requests</div>

				<div class="prayers-list">
					{#each prayerRequests as prayer (prayer.id)}
						<div class="prayer-entry">
							<div class="prayer-details">
								<span class="category">{prayer.category}</span>
								<p class="actual-request">{prayer.request}</p>
								<div class="prayer-dates">
									<small>Created: {new Date(prayer.dateCreated).toLocaleDateString()}</small>
									{#if prayer.isAnswered}
										<small>Answered: {new Date(prayer.dateAnswered).toLocaleDateString()}</small>
									{/if}
								</div>
							</div>
							<div class="prayer-actions">
								{#if !prayer.isAnswered}
									<button class="action" on:click={() => markAsAnswered(prayer)}
										>Mark as Answered</button
									>
								{/if}
								<button class="action" on:click={() => deletePrayer(prayer.id)}>Delete</button>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
		<div class="right-col">
			<div class="new-pray right-w glass" transition:fade>
				<div class="titling">New Prayer Request</div>
				<div class="request-content">
					<textarea
						bind:value={newPrayer.request}
						class="prayer-request-text"
						placeholder="Enter prayer request"
					></textarea>
					<select bind:value={newPrayer.category}>
						<option value="" disabled selected>Select Category</option>
						{#each categories as category}
							<option value={category}>{category}</option>
						{/each}
					</select>
					<button on:click={addPrayer} class="add-prayer">Add Prayer</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.titling {
		font-size: 18px;
		font-weight: 600;
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

	.prayers-list .prayer-entry {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 16px 0px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.2);
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
		gap: 32px;
		max-width: 380px;
	}

	select {
		width: 100%;
		margin: 0px;
		color: white;
		padding: 10px 12px;
		border-radius: 8px;
		border: 1px solid #ffffff3e;
	}

	.new-pray {
		display: flex;
		flex-direction: column;
		color: white;
	}

	.add-prayer {
		background: #ffa5008a !important;
		color: white;
		padding: 12px;
		border-radius: 8px;
	}

	.prayer-request-text {
		min-height: 80px;
		color: white;
	}
	.request-content {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.actual-request {
		margin-top: 8px;
		margin-bottom: 6px;
	}

	.category {
		font-size: 13px;
		font-weight: 600;
	}

	.action {
		color: white;
		background: #ffa5003b !important;
		padding: 6px 12px;
		border-radius: 8px;
	}
	.prayer-actions {
		display: flex;
		gap: 8px;
		margin-top: 12px;
	}
	.prayer-dates {
		opacity: 0.6;
	}
</style>
