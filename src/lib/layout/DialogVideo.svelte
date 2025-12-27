<script>
	import { fade } from 'svelte/transition';

	let dialog;

	export let videoUrl; // can be a key like "introduction" OR a full youtube url OR a raw id

	// Map your existing keys -> YouTube video IDs
	const YT_MAP = {
		introduction: '364cl9DMeSM',
		gettingstarted: 'lO0kEoXh25k', // How to use the Journal
		biblereading: 'PTCFXaBw-Yo', // Meeting God in his Word
		prayerjournal: '0l69NQYh5Zo'
	};

	let iframeSrc = '';

	function extractYouTubeId(input) {
		if (!input) return null;

		// If it's a known key
		if (YT_MAP[input]) return YT_MAP[input];

		// If it's already a likely YouTube ID (11 chars)
		if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;

		// Try to parse common YouTube URL shapes
		const match =
			input.match(/[?&]v=([a-zA-Z0-9_-]{11})/) ||
			input.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/) ||
			input.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);

		return match?.[1] ?? null;
	}

	function buildEmbedSrc(videoId) {
		const params = new URLSearchParams({
			// Autoplay is set to '0' to prevent the "Unusual Traffic" IP ban
			autoplay: '0',
			rel: '0',
			modestbranding: '1'
		});

		// Using standard youtube.com matches the official snippet and is more stable
		return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
	}

	function openDialog() {
		const id = extractYouTubeId(videoUrl);
		if (id) {
			iframeSrc = buildEmbedSrc(id);
			dialog.showModal();
		}
	}

	function closeDialog() {
		dialog.close();
		// Clearing src stops playback immediately
		iframeSrc = '';
	}

	function handleDialogClose() {
		closeDialog();
	}
</script>

<button on:click={openDialog} class="transparent" type="button" aria-label="Open Video">
	<slot name="trigger"></slot>
</button>

<dialog bind:this={dialog} on:close={handleDialogClose} transition:fade>
	<div class="video-frame">
		{#if iframeSrc}
			<iframe
				src={iframeSrc}
				width="100%"
				height="100%"
				title="YouTube video player"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				referrerpolicy="strict-origin-when-cross-origin"
				allowfullscreen
			/>
		{:else}
			<div class="fallback">Loading Video...</div>
		{/if}
	</div>

	<form method="dialog">
		<button type="button" class="close-button" on:click={closeDialog} aria-label="Close">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				width="20"
				height="20"
				fill="currentColor"
			>
				<line
					x1="4"
					y1="4"
					x2="20"
					y2="20"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
				/>
				<line
					x1="20"
					y1="4"
					x2="4"
					y2="20"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
				/>
			</svg>
		</button>
	</form>
</dialog>

<style>
	.transparent {
		padding: 0;
		background: transparent;
		border: none;
		cursor: pointer;
	}

	dialog {
		padding: 0;
		background: transparent;
		border: none;
		max-width: min(960px, 92vw);
		width: 92vw;
	}

	.video-frame {
		width: 100%;
		aspect-ratio: 16 / 9;
		background: black;
		border-radius: 12px;
		overflow: hidden;
		position: relative;
	}

	iframe {
		width: 100%;
		height: 100%;
		display: block;
	}

	.fallback {
		color: white;
		padding: 24px;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}

	.close-button {
		position: absolute;
		background: rgba(0, 0, 0, 0.8);
		top: 10px;
		right: 10px;
		width: 40px;
		height: 40px;
		display: flex;
		border-radius: 50%;
		justify-content: center;
		align-items: center;
		color: white;
		border: none;
		cursor: pointer;
		transition: background 0.2s;
	}

	.close-button:hover {
		background: black;
	}

	::backdrop {
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(2px);
	}
</style>
