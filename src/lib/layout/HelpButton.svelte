<script>
	import { fade } from 'svelte/transition';
</script>

<button class="help-button" transition:fade>
	Need Help?
	<div class="description">Click here to get more information</div>
</button>

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
