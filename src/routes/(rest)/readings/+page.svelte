<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import db from '$lib/js/db.js';
	import { selectedPassage, selectedDate } from '$lib/js/store.js';
	import ReferenceChecker from '$lib/ReferenceChecker.svelte';

	let date;
	$: date = $selectedDate;

	let devotionDetails = null;
	let error = null;

	async function loadDevotion() {
		try {
			let details = await db.daily_entries.where('date').equals(date).first();
			if (!details) {
				devotionDetails = {
					date,
					journal_entry: '',
					intention: '',
					revised_memory_verse: false,
					used_prayer_journal: false
				};
			} else {
				devotionDetails = { ...details };
			}
		} catch (err) {
			console.error('Failed to load devotion details:', err);
			error = err.message || 'Failed to load data';
		}
	}

	async function saveField(field, value) {
		try {
			await db.daily_entries.update(devotionDetails.id, { [field]: value });
			console.log(`${field} saved`);
		} catch (err) {
			console.error(`Failed to update ${field}:`, err);
			error = `Failed to update ${field}`;
		}
	}

	onMount(() => {
		loadDevotion();
	});

	$: date, loadDevotion(); // Load devotion when date changes
	$: if (devotionDetails) {
		devotionDetails.journal_entry && saveField('journal_entry', devotionDetails.journal_entry);
		devotionDetails.intention && saveField('intention', devotionDetails.intention);
	}

	let buttonClicked = false;
</script>

{#if devotionDetails}
	<div class="wraps">
		<div class="left-col glass" transition:fade>
			{#if !buttonClicked}
				<div class="readings-selector">
					<div class="titling">Readings</div>
					<div class="readings">
						<div class="year-readings">
							<div class="year-title">Year 1</div>
							<div class="passages">
								{#each ['y1p1', 'y1p2', 'y1p3', 'y1p4'] as passage}
									<button
										class="passage"
										on:click={() => {
											selectedPassage.set(devotionDetails[passage]);
											buttonClicked = true;
										}}
									>
										{devotionDetails[passage]}
									</button>
								{/each}
							</div>
						</div>
						<div class="year-readings">
							<div class="year-title">Year 2</div>
							<div class="passages">
								{#each ['y2p1', 'y2p2'] as passage}
									<button
										class="passage"
										on:click={() => {
											selectedPassage.set(devotionDetails[passage]);
											buttonClicked = true;
										}}
									>
										{devotionDetails[passage]}
									</button>
								{/each}
							</div>
						</div>
					</div>
				</div>
			{:else}
				<div class="wrapper-back">
					<div class="titling">
						{$selectedPassage}
					</div>
					<button
						class="passage go-back"
						on:click={() => {
							buttonClicked = false;
						}}>Go Back</button
					>
				</div>
				<ReferenceChecker />
			{/if}
		</div>

		<div class="right-col">
			<div class="journal right-w glass" transition:fade>
				<div class="titling">Journal</div>

				<textarea
					id="journal"
					bind:value={devotionDetails.journal_entry}
					placeholder="Write your thoughts on today's reading..."
				></textarea>
			</div>
			<div class="i-am-statement right-w glass" transition:fade>
				<div class="titling">I will</div>
				<textarea
					id="intention"
					bind:value={devotionDetails.intention}
					placeholder="determine to do today..."
				></textarea>
			</div>
		</div>
	</div>
{/if}

<style>
	.wraps {
		display: flex;
		flex: 1;
		width: 100%;
		gap: 32px;
	}

	.left-col {
		flex-direction: column;
		height: calc(100vh - 64px);
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
	.glass {
		background: #0f0f0fad;
		backdrop-filter: blur(50px);
		border-radius: 16px;
		padding: 32px;
	}
	.right-w {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: 12px;
	}
	.readings {
		display: flex;
		flex-direction: column;
		gap: 56px;
		margin-top: 32px;
	}

	.left-col.glass {
		flex-direction: column;
	}

	.year-readings {
		display: flex;
		flex-direction: column;
	}

	.passages {
		display: flex;
		flex-direction: column;
	}

	.passage {
		padding: 16px 0px;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		color: white;
		transition: all 200ms;
		text-align: left;
	}

	.passage:hover {
		background: rgba(255, 255, 255, 0.15);
	}

	.year-title {
		font-size: 16px;
		font-weight: 600;
		margin-bottom: 12px;
	}

	.titling {
		font-size: 18px;
		font-weight: 600;
	}
	textarea {
		color: white;
		resize: none;
		flex: 1;
	}
	::placeholder {
		color: rgba(255, 255, 255, 0.5);
	}
	.go-back {
		padding: 16px;
		background: #ffffff1a;
		border-radius: 16px;
		color: white;
		transition: all 200ms;
		position: absolute;
		right: 24px;
		top: 20px;
	}

	.wrapper-back {
		display: flex;
		padding-bottom: 12px;
		/* align-items: center;
    justify-content: space-between; */
	}

	.journal {
		min-height: 65%;
	}
</style>
