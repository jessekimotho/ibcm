<script>
	import { onMount } from 'svelte';
	import db from '$lib/js/db.js';
	import { fade } from 'svelte/transition';
	import DialogVideo from '$lib/layout/DialogVideo.svelte';
	import HelpButton from '$lib/layout/HelpButton.svelte';

	let loaded;
	let prayerRequests = [];
	let newPrayer = {
		category: '',
		request: '',
		dateCreated: new Date().toISOString(),
		dateAnswered: null,
		isAnswered: false
	};
	let categories = [
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
					{#if prayerRequests.length > 0}
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
					{:else}
						<p>You have no prayer requests yet</p>
					{/if}
				</div>
			</div>
		</div>
		<div class="right-col">
			<div class="new-pray right-w glass" transition:fade>
				<div class="titling">New Prayer Request</div>
				<div class="request-content">
					<select bind:value={newPrayer.category}>
						<option value="" disabled selected>Click here to select Prayer Forms</option>
						{#each categories as category}
							<option value={category}>{category}</option>
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
	.titling {
		font-size: 18px;
		font-weight: 600;
		margin-bottom: 28px;
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
		padding: 16px;
		/* border: 1px solid rgba(255, 255, 255, 0.2); */
		border-radius: 12px;
		margin-bottom: 20px;
		background: #ffffff17;
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

	.help-button {
		box-shadow: 5px 5px 20px 10px #0000003d;
		color: white;
		padding: 18px 12px;
		border-radius: 8px;
		background: #0f0f0fad;
		backdrop-filter: blur(50px);
		border-radius: 16px;
		transition: all 300ms;
		width: 100%;
	}

	.description {
		color: #ffca67;
		margin-top: 2px;
		margin-bottom: 4px;
		font-size: 14px;
		text-decoration: underline;
		transition: all 300ms;
	}
	.help-button:hover {
		background: #1f1503ba;
	}
	.help-button:hover .description {
		color: #f6cf86;
	}
</style>
