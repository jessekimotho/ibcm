<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let loaded = false;

	onMount(() => {
		loaded = true;
	});
</script>

{#if loaded}
	<div class="wraps">
		<div class="left-col glass" transition:fade>
			<div class="readings-selector">
				<div class="college-students"></div>
				<div class="titling">Donate</div>
				<div class="message">
					This app was created as a tool to help the students of IBCM develop and grow in their
					practice of personal devotions with meaningful Bible reading and prayer. Your donation
					will provide financial assistance to students training for pastoral and church planting
					ministry in Kenya. Thank you for your donation.
				</div>

				<div class="donate-section">
					<a
						class="button-donate"
						href=" https://www.continuetogive.com/4923881/donation_prompt"
						target="_blank"
					>
						Make a Donation
					</a>
				</div>
			</div>
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

	.left-col {
		flex-direction: column;
		overflow: auto;
		flex: 1;
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
		margin-top: 32px;
	}
	::placeholder {
		color: rgba(255, 255, 255, 0.5);
	}

	.college-students {
		background: url(/images/college.jpg);
		background-position: center;
		background-size: cover;
		width: 100%;
		min-height: 400px;
		border-radius: 12px;
		flex: 1;
	}

	.message {
		padding: 24px 0px;
		max-width: 400px;
	}

	.button-donate {
		padding: 12px 20px;
		text-decoration: none;
		color: white;
		background: #ffa5007a;
		border-radius: 8px;
	}
	.readings-selector {
		display: flex;
		flex-direction: column;
		height: 100%;
		flex: 1;
	}

	.donate-section {
		display: flex;
	}
</style>
