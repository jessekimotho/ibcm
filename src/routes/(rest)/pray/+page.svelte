<script>
	import { onMount } from 'svelte';
	import db from '$lib/js/db.js';
	import DialogVideo from '$lib/layout/DialogVideo.svelte';
	import HelpButton from '$lib/layout/HelpButton.svelte';
	import PrayerAccordion from '$lib/layout/PrayerAccordion.svelte';
	import { fade } from 'svelte/transition';

	let loaded = false;

	// Data for creating a new prayer request
	let newPrayer = {
		category: '',
		request: '',
		dateCreated: new Date().toISOString(),
		dateAnswered: null,
		isAnswered: false
	};

	// Function to add a new prayer request
	async function addPrayer() {
		if (newPrayer.category && newPrayer.request) {
			await db.prayers.add({ ...newPrayer });
			// Reset the new prayer form after saving
			newPrayer = {
				category: '',
				request: '',
				dateCreated: new Date().toISOString(),
				dateAnswered: null,
				isAnswered: false
			};
			// Optionally: You could trigger an event or refresh logic here
			// so that PrayerAccordion reloads its data.
		}
	}

	onMount(() => {
		loaded = true;
	});
</script>

{#if loaded}
	<div class="wraps">
		<!-- Left column: Accordion view for grouped prayer requests -->
		<div class="left-col glass">
			<PrayerAccordion />
		</div>

		<!-- Right column: New prayer request form and help dialog -->
		<div class="right-col">
			<DialogVideo videoUrl="prayerjournal">
				<div class="help-button flex flex-col gap-2" slot="trigger" transition:fade>
					<span class="need-help-title mb-4">Need Help?</span>
					<a class="view-guide-button" href="/info/prayer"> Click here to view guide </a>
					<button class="view-guide-button"> Click here to watch the introduction video </button>
				</div>
			</DialogVideo>
		</div>
	</div>
{/if}

<style>
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
	.new-pray {
		display: flex;
		flex-direction: column;
		color: white;
		padding-bottom: 36px;
	}
	.new-titling {
		margin-bottom: 24px;
	}
	select {
		width: 100%;
		margin: 0;
		color: white;
		padding: 12px;
		border-radius: 8px;
		background: #ffffff14;
	}
	.prayer-request-text {
		min-height: 80px;
		color: white;
		background: #ffffff14;
		border-radius: 8px;
		padding: 12px;
		margin-top: 16px;
	}
	.add-prayer {
		background: #ffa5008a;
		color: white;
		padding: 12px;
		border-radius: 8px;
		margin-top: 8px;
	}
	.help-button {
		box-shadow: 5px 5px 20px 10px #0000003d;
		color: white;
		padding: 18px 12px;
		border-radius: 8px;
		display: flex;
		gap: 4px;
		flex-direction: column;
		background: #0f0f0fad;
		backdrop-filter: blur(50px);
		border-radius: 16px;
		transition: all 300ms;
		width: 100%;
		padding: 20px;
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
	.view-guide-button {
		color: white;
		background: #ffa5003b;
		padding: 8px 12px;
		border-radius: 8px;
		border: none;
		cursor: pointer;
		flex-shrink: 0;
		margin-top: 4px;
		text-decoration: none;
	}
	.need-help-title {
		font-size: 18px;
		font-weight: 600;
		margin-bottom: 8px;
	}
</style>
