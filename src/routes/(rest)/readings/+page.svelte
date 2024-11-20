<div class="wraps">
	<div class="left-col glass">stuff goes here</div>

	<div class="right-col">
		<div class="journal right-w glass">Journal here</div>
		<div class="i-am-statement right-w glass">I am..</div>
	</div>
</div>

<style>
	.wraps {
		display: flex;
		flex: 1;
		width: 100%;
		gap: 32px;
	}

	.left-col {
		display: flex;
		flex: 1;
	}

	.right-col {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: 32px;
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
	}
</style>
