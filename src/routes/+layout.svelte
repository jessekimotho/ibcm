<script>
	import '../app.css';
	import Calendar from '../lib/layout/Calendar.svelte';
</script>

<div class="page-structure">
	<div class="navbar">
		<div class="calendar"><Calendar /></div>

		<div class="button-group">
			<div class="button-complex">
				<div class="button-title">Pray</div>
				<div class="subtext">You haven't prayed today</div>
			</div>
			<div class="button-complex">
				<div class="button-title">Planner</div>
				<div class="subtext">You have no daily tasks coming up today</div>
			</div>
			<div class="button-complex">
				<div class="button-title">Readings</div>
				<div class="subtext">0/4 complete</div>
			</div>
			<div class="button-complex">
				<div class="button-title">Goals</div>
				<div class="subtext">You have 4 weekly goals lined up today</div>
			</div>
		</div>
	</div>
	<div class="window">
		<slot />
	</div>
</div>
