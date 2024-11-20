<script>
	import { selectedDate } from '$lib/js/store.js';
	import { onMount } from 'svelte';

	let today = new Date();
	let currentMonth = today.getMonth();
	let currentYear = today.getFullYear();

	const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	function getDaysInMonth(month, year) {
		let date = new Date(year, month, 1);
		let days = [];
		let firstDay = date.getDay();
		let totalDays = new Date(year, month + 1, 0).getDate();

		for (let i = 0; i < firstDay; i++) {
			days.push(null);
		}

		for (let i = 1; i <= totalDays; i++) {
			days.push(i);
		}

		return days;
	}

	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	// Helper to format the date
	function formatDate(dateString) {
		if (!dateString) return `${currentMonth + 1}/${currentYear}`;
		const [year, month, day] = dateString.split('-').map(Number);
		return `${day} ${months[month - 1]} ${year}`;
	}

	function changeMonth(change) {
		currentMonth += change;
		if (currentMonth < 0) {
			currentYear -= 1;
			currentMonth = 11;
		} else if (currentMonth > 11) {
			currentYear += 1;
			currentMonth = 0;
		}
	}

	async function logDate(day) {
		const year = currentYear;
		const month = currentMonth + 1; // Months are zero-indexed
		const date_full = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
		$selectedDate = date_full;
		console.log($selectedDate);
	}

	onMount(() => {
		$selectedDate = today.toISOString().split('T')[0];
	});
</script>

<div class="calendar" transition:fade>
	<div class="calendar-container">
		<div class="calendar-header">
			<button on:click={() => changeMonth(-1)}>←</button>
			<div>
				{formatDate($selectedDate)}
			</div>
			<button on:click={() => changeMonth(1)}>→</button>
		</div>

		<div class="days-of-week">
			{#each daysOfWeek as day}
				<div>{day}</div>
			{/each}
		</div>

		<div class="days">
			{#each getDaysInMonth(currentMonth, currentYear) as day}
				<div
					class="day {day === null
						? 'empty'
						: ''} {`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` ===
					$selectedDate
						? 'active'
						: ''}"
					on:click={() => day && logDate(day)}
				>
					{day}
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.calendar-container {
		text-align: center;
		color: white;
		margin: auto;
	}

	.calendar-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
	}

	.days-of-week {
		display: flex;
		justify-content: space-around;
		font-weight: bold;
		margin-bottom: 12px;
	}

	.days {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 5px;
	}

	.day {
		width: 36px;
		height: 36px;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		border: 1px solid transparent;
		transition: all 200ms;
		border-radius: 12px;
		cursor: pointer;
		text-align: center;
		border: 1px solid transparent;
		transition: all 200ms;
		border-radius: 12px;
		cursor: pointer;
	}
	.day:hover {
		background-color: rgba(240, 240, 240, 0.159);
	}

	.empty {
		visibility: hidden;
	}
	button {
		color: white;
	}
	.active {
		background-color: #ffa5008a !important;
		box-shadow: 0px 0px 15px #ffa5008a;
	}
	.active:hover {
		background-color: #ffa6009f !important;
		box-shadow: 0px 0px 30px #ffa6009f;
	}
</style>
