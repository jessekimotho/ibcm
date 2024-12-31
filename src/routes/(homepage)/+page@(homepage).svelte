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

				<div class="sectional-wrap">
					<div class="sectional">
						<div class="message-section">
							<div class="titling">Watch the Introduction Video</div>

							<div class="message">
								Thank you for downloading the IBCM devotional app! Here's a quick word from IBCM
								Head, Dr Brent Halstead.
							</div>

							<DialogVideo videoUrl="introduction">
								<div class="button-wrap" slot="trigger">
									<button class="button-donate"> Watch Video </button>
								</div>
							</DialogVideo>
						</div>
						<div class="teaser intro-back"></div>
					</div>

					<div class="sectional">
						<div class="message-section">
							<div class="titling">How to use the Journal</div>

							<div class="message">
								Discover practical tips for making the most of your devotional journal. Pastor.
								Halstead shares valuable insights to help you get started.
							</div>

							<div class="buttons">
								<DialogVideo videoUrl="introduction">
									<div class="button-wrap" slot="trigger">
										<button class="button-donate"> Watch Video</button>
									</div>
								</DialogVideo>
								<button class="button-resources">Read Pamphlet</button>
							</div>
						</div>
						<div class="teaser started-back"></div>
					</div>

					<div class="sectional">
						<div class="message-section">
							<div class="titling">Meeting God in his Word</div>

							<div class="message">
								Get tips for daily Bible reading, journaling, and creating "I will" statements to
								apply God’s Word to your life.
							</div>

							<div class="buttons">
								<DialogVideo videoUrl="biblereading">
									<div class="button-wrap" slot="trigger">
										<button class="button-donate"> Watch Video</button>
									</div>
								</DialogVideo>
								<button class="button-resources">Read Pamphlet</button>
							</div>
						</div>
						<div class="teaser word-back"></div>
					</div>

					<div class="sectional">
						<div class="message-section">
							<div class="titling">Meeting God in Prayer</div>

							<div class="message">
								Learn how to make meaningful prayer requests and follow helpful formats and guides
								for effective, heartfelt prayer.
							</div>

							<div class="buttons">
								<DialogVideo videoUrl="prayerjournal">
									<div class="button-wrap" slot="trigger">
										<button class="button-donate"> Watch Video</button>
									</div>
								</DialogVideo>
								<button class="button-resources">Read Pamphlet</button>
							</div>
						</div>
						<div class="teaser pray-back"></div>
					</div>
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
		line-height: 1.3;
		margin-bottom: auto;
	}
	.buttons {
		margin-top: auto;
		display: flex;
		gap: 16px;
	}

	.button-donate {
		padding: 12px 20px;
		text-decoration: none;
		color: white;
		background: #ffa5007a;
		border-radius: 8px;
	}

	.button-resources {
		padding: 12px 20px;
		text-decoration: none;
		color: white;
		background: rgba(255, 255, 255, 0.15);
		/* border: 1px solid rgba(255, 255, 255, 0.4); */
		border-radius: 8px;
		flex: 1;
	}

	.button-wrap {
		display: flex;
	}

	.home-icon {
		width: 100px;
	}

	.sectional {
		border-radius: 12px;
		display: flex;
		background: #ffffff17;
		display: flex;
		overflow: hidden;
		flex: 1;
		min-width: 320px;
		flex-direction: column-reverse;
	}

	.teaser {
		width: 100%;
		height: 140px;
		background-size: cover;
		background-position: center;
	}

	.intro-back {
		background-image: url(/images/halstead.png);
	}
	.started-back {
		background-image: url(/images/phone.jpg);
	}
	.word-back {
		background-image: url(/images/devotional.jpg);
	}
	.pray-back {
		background-image: url(/images/pray.jpg);
	}
	.message-section {
		display: flex;
		flex-direction: column;
		padding: 24px;
		padding-top: 32px;
		padding-bottom: 28px;
		padding-right: 32px;
		flex: 1;
		/* max-width: 400px; */
	}
	.owner {
		font-size: 12px;
		opacity: 0.7;
	}

	.subtitile {
		font-size: 16px;
	}

	.sectional-wrap {
		display: flex;
		flex-wrap: wrap;
		gap: 32px;
	}

	.readings-selector {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}
</style>
