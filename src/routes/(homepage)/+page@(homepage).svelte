<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import DialogVideo from '$lib/layout/DialogVideo.svelte';

	let loaded = false;

	onMount(() => {
		loaded = true;
	});
</script>

{#if loaded}
	<div class="wraps">
		<div class="left-col glass" transition:fade>
			<div class="readings-selector">
				<div class="intro-sequence">
					<img src="/images/icons/web-app-manifest-512x512.png" class="home-icon" alt="" />
					<div class="titles">
						<div class="title-sub">
							<div class="title-app">Meeting with God</div>
							<div class="subtitile">A Daily Devotional Journal</div>
						</div>
						<div class="owner">by the Independent Baptist College of Ministry</div>
					</div>
				</div>

				<div class="sectional">
					<div class="message-section">
						<div class="titling">Watch the Introduction Video</div>

						<div class="message">
							We are so glad you downloaded the IBCM devotional app. We've prepared a series of
							videos to help you get started on using the app
						</div>

						<DialogVideo videoUrl="introduction">
							<div class="button-wrap" slot="trigger">
								<button class="button-donate"> Click here to watch the Video </button>
							</div>
						</DialogVideo>
					</div>
					<div class="teaser intro-back"></div>
				</div>

				<div class="sectional">
					<div class="message-section">
						<div class="titling">How to use the Devotional</div>

						<div class="message">
							We have some insights on how you can best make use of the devotional journal. Get
							started with some tips from Dr. Halstead
						</div>

						<DialogVideo videoUrl="introduction">
							<div class="button-wrap" slot="trigger">
								<button class="button-donate"> Click here to watch the Video </button>
							</div>
						</DialogVideo>
					</div>
					<div class="teaser started-back"></div>
				</div>
			</div>
		</div>
		<!-- <div class="right-col glass" transition:fade>
			<div class="titling">Today's Progress</div>
		</div> -->
	</div>
{/if}

<style>
	.video-sec {
		display: flex;
		gap: 32px;
	}

	.video {
		display: flex;
	}

	.titles {
		display: flex;
		flex-direction: column;
		gap: 4px;
		/* align-items: center; */
		justify-content: center;
	}

	.title-app {
		font-size: 24px;
		font-weight: bold;
	}
	.intro-sequence {
		display: flex;
		gap: 32px;
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
		max-width: 800px;
	}

	.glass {
		background: #0f0f0fad;
		backdrop-filter: blur(50px);
		border-radius: 16px;
		padding: 32px;
	}
	.left-col.glass {
		flex-direction: column;
	}

	.titling {
		font-size: 18px;
		font-weight: 600;
	}
	::placeholder {
		color: rgba(255, 255, 255, 0.5);
	}

	.message {
		padding-top: 12px;
		padding-bottom: 24px;
		max-width: 400px;
	}

	.button-donate {
		padding: 12px 20px;
		text-decoration: none;
		color: white;
		background: #ffa5007a;
		border-radius: 8px;
	}

	.button-wrap {
		display: flex;
	}

	.home-icon {
		width: 100px;
	}

	.sectional {
		margin-top: 32px;
		border-radius: 12px;
		display: flex;
		background: #ffffff17;
		display: flex;
		overflow: hidden;
	}

	.teaser {
		flex: 1;
		background-size: cover;
		background-position: center;
	}

	.intro-back {
		background-image: url(images/devotional.jpg);
	}
	.started-back {
		background-image: url(images/phone.jpg);
	}
	.message-section {
		display: flex;
		flex-direction: column;
		padding: 24px;
		padding-top: 32px;
		padding-bottom: 32px;
		padding-right: 32px;
		max-width: 400px;
	}
	.owner {
		font-size: 12px;
		opacity: 0.7;
	}

	.subtitile {
		font-size: 16px;
	}
</style>
