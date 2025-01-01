<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import db from '$lib/js/db.js';
	import { selectedPassage, selectedDate } from '$lib/js/store.js';
	import ReferenceChecker from '$lib/ReferenceChecker.svelte';
	import DialogVideo from '$lib/layout/DialogVideo.svelte';
	import HelpButton from '$lib/layout/HelpButton.svelte';

	let devotionDetails;
	let error = null;
	let buttonClicked = 'false';
	let loaded;

	async function loadDevotion() {
		buttonClicked = 'false';
		try {
			const [year, month, day] = $selectedDate.split('-').map(Number); // Extract day, month, year

			console.log('This is the day' + [day]);
			console.log('This is the month' + [month]);

			// Fetch data from `daily_references` table
			const referenceDetails = await db.daily_references
				.where('[day+month]')
				.equals([day, month])
				.first();

			// Fetch data from `daily_entries` table
			const entryDetails = await db.daily_entries
				.where('[day+month+year]')
				.equals([day, month, year])
				.first();

			if (!referenceDetails) {
				console.warn('No reference details found for this date');
			}

			if (!entryDetails) {
				console.warn('No entry details found for this date');
			}

			// Merge details from both tables
			devotionDetails = {
				day,
				month,
				year,
				...referenceDetails,
				...entryDetails,
				journal_entry: entryDetails?.journal_entry || '',
				intention: entryDetails?.intention || '',
				revised_memory_verse: entryDetails?.revised_memory_verse || false,
				used_prayer_journal: entryDetails?.used_prayer_journal || false
			};
		} catch (err) {
			console.error('Failed to load devotion details:', err);
			error = err.message || 'Failed to load data';
		}
	}

	async function saveField(field, value) {
		try {
			if (!devotionDetails) {
				throw new Error('Devotion details are not loaded');
			}

			if (devotionDetails.id) {
				await db.daily_entries.update(devotionDetails.id, { [field]: value });
			} else {
				const id = await db.daily_entries.add({
					day: devotionDetails.day,
					month: devotionDetails.month,
					year: devotionDetails.year,
					[field]: value
				});
				devotionDetails.id = id;
			}
			console.log(`${field} saved`);
		} catch (err) {
			console.error(`Failed to update ${field}:`, err);
			error = `Failed to update ${field}`;
		}
	}

	function selectPassage(passage) {
		selectedPassage.set(passage);
		buttonClicked = 'true';
	}

	$: if ($selectedDate) {
		devotionDetails = null; // Reset to indicate loading state
		buttonClicked = 'false'; // Reset buttonClicked state
		loadDevotion();
	}

	onMount(() => {
		loaded = true;
		loadDevotion();
	});
</script>

{#if loaded}
	<div class="wraps">
		<div class="left-col glass" transition:fade>
			{#if devotionDetails}
				{#if buttonClicked !== 'true'}
					<div class="readings-selector">
						<div class="titling">Bible Readings</div>
						<div class="readings">
							{#each [{ title: 'Year 1', passages: ['y1p1', 'y1p2'] }, { title: 'Psalms & Proverbs', passages: ['y1p3', 'y1p4'] }, { title: 'Year 2', passages: ['y2p1', 'y2p2'] }] as { title, passages }}
								<div class="year-readings">
									<div class="year-title">{title}</div>
									<div class="passages">
										{#each passages as passage}
											<button
												class="passage"
												on:click={() => selectPassage(devotionDetails[passage])}
											>
												{devotionDetails[passage] || '—'}
											</button>
										{/each}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{:else if buttonClicked === 'true'}
					<div class="wrapper-back">
						<div class="titling">
							{$selectedPassage || 'No Passage Selected'}
						</div>
						<button class="go-back" on:click={() => (buttonClicked = 'false')}> Go Back </button>
					</div>
					<ReferenceChecker />
				{/if}
			{/if}
		</div>

		<div class="right-col">
			<div class="journal right-w glass" transition:fade>
				<div class="titling">Journal</div>
				{#if devotionDetails}
					<textarea
						id="journal"
						bind:value={devotionDetails.journal_entry}
						placeholder="Write your thoughts on today's reading..."
						on:input={() => saveField('journal_entry', devotionDetails.journal_entry)}
					></textarea>
				{/if}
			</div>

			<div class="i-am-statement right-w glass" transition:fade>
				<div class="titling">I will</div>
				{#if devotionDetails}
					<textarea
						id="intention"
						bind:value={devotionDetails.intention}
						placeholder="Determine to do today..."
						on:input={() => saveField('intention', devotionDetails.intention)}
					></textarea>
				{/if}
				<div class="informational">
					From your Bible reading, record in what specific way God spoke to you - Write an “I Will”
					statement of obedience.
					<ol>
						<li>If it involves a decision – make it!</li>
						<li>If it involves an action – plan it!</li>
						<li>If it requires further study – do it!</li>
						<li>If it leads to prayer – pray!</li>
					</ol>
				</div>
			</div>
			<DialogVideo videoUrl="biblereading">
				<HelpButton slot="trigger" />
			</DialogVideo>
		</div>
	</div>
{/if}

<style>
	.readings-selector {
		padding: 32px;
	}
	.wraps {
		display: flex;
		flex: 1;
		width: 100%;
		height: 100%;
		gap: 32px;
	}

	.left-col {
		flex-direction: column;
		overflow: auto;
		flex: 1;
		display: flex;
		padding: 0 !important;
	}

	.right-col {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: 24px;
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
		gap: 24px;
		margin-top: 32px;
	}

	.left-col.glass {
		flex-direction: column;
	}

	.year-readings {
		display: flex;
		flex-direction: column;
		padding: 20px;
		background: #ffffff15;
		border-radius: 12px;
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
	.i-am-statement {
		padding-bottom: 16px;
	}

	ol {
		padding-left: 16px;
	}
	.passage:hover {
		background: rgba(255, 255, 255, 0.15);
		padding: 16px 12px;
		margin-left: -12px;
		width: calc(100% + 24px);
		border-radius: 4px;
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
		padding: 12px 16px;
		background: #ffffff1a;
		border-radius: 16px;
		color: white;
		transition: all 200ms;
	}

	.wrapper-back {
		display: flex;
		padding: 18px 32px;
		height: 84px;
		min-height: 84px;
		border-bottom: 1px solid #ffffff3b;
		justify-content: space-between;
		align-items: center;
	}

	.journal {
		min-height: 350px;
	}
</style>
