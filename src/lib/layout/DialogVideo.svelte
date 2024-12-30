<script>
	import { fade } from 'svelte/transition';

	let dialog; // Reference to the <dialog> element
	let video;
	export let videoUrl;

	// Function to open the dialog as a modal
	function openDialog() {
		dialog.showModal();
		if (video) {
			// Attempt to play the video
			video.play().catch((error) => {
				console.error('Error playing video:', error);
			});
		}
	}

	// Function to close the dialog and reset the video
	function closeDialog() {
		dialog.close();
		if (video) {
			video.pause(); // Pause the video
			video.currentTime = 0; // Reset playback to the beginning
		}
	}

	// Listen for the dialog's close event
	function handleDialogClose() {
		closeDialog();
	}
</script>

<button on:click={openDialog} class="help-button" transition:fade>
	Need Help?
	<div class="description">Click here to get more information</div>
</button>

<dialog bind:this={dialog} on:close={handleDialogClose}>
	<video bind:this={video} src="/videos/{videoUrl}.mp4" controls></video>
	<form method="dialog">
		<button type="button" class="close-button" on:click={closeDialog} autofocus
			><svg
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
	.help-button {
		box-shadow: 5px 5px 20px 10px #0000003d;
		color: white;
		padding: 18px 12px;
		border-radius: 8px;
		background: #0f0f0fad;
		backdrop-filter: blur(50px);
		border-radius: 16px;
		transition: all 300ms;
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

	dialog {
		padding: 0;
		background: transparent;
		border: none;
	}
	.close-button {
		position: absolute;
		background: black;
		top: 10px;
		right: 10px;
		width: 40px;
		height: 40px;
		display: flex;
		border-radius: 50px;
		justify-content: center;
		align-items: center;
		color: white;
	}

	::backdrop {
		background: rgba(0, 0, 0, 0.4);
	}
</style>
