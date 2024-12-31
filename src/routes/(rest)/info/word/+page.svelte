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
			</div>
			<main>
				<div class="titling">Meeting God in His Word</div>
				<p>
					There is no set or “inspired” system for reading the Bible regularly. The system you
					choose will likely be that which best meets your personal needs and which best fits into
					your schedule. The most important thing to recognize is that every Christian should read
					the Word of God daily.
				</p>
				<p>
					When we talk of “Devotional Bible Study” we are referring to reading the Bible in such a
					way that will allow God to speak to me through His Word. Therefore, the title, “Meeting
					God in His Word,” describes the goal of daily devotional Bible study. God speaking to me
					is just one-way communication! Devotional Bible study should also incorporate personal
					prayer (me speaking to God) to complete the communication cycle.
				</p>

				<h2>Focus Areas of Devotional Bible Study</h2>
				<ul>
					<li>The Psalms are written to show you God’s LOVE.</li>
					<li>The Proverbs are written to show you God’s WISDOM.</li>
					<li>The Old Testament is written to show you an EXAMPLE.</li>
					<li>The New Testament is written to show you the LORD JESUS CHRIST.</li>
				</ul>

				<p>This Bible reading schedule will allow you to:</p>
				<ul>
					<li>Read through the Old Testament in two years,</li>
					<li>Read through the New Testament in two years,</li>
					<li>Read through the Psalms twice each year, and</li>
					<li>Read through Proverbs three times each year.</li>
				</ul>

				<h2>Developing Your Bible Reading Habit</h2>
				<p>
					For those not yet used to regular Bible reading, we recommend that you start with one or
					two sections daily (Psalms and the New Testament make a good start). As you develop in
					your habit of daily Bible reading, your goal should be to add the other sections as you
					are able.
				</p>

				<p>
					To be effective, Devotional Bible Study <strong>CANNOT BE DONE</strong> with a “read my
					verses to get done” attitude! Rather, Devotional Bible Study <strong>MUST BE DONE</strong>
					with an attitude of expecting God to speak.
				</p>

				<h2>Steps for Effective Devotional Bible Study</h2>
				<ol>
					<li>
						Determine a set time and place where you can be undisturbed (as much as possible) for as
						much time as it takes to receive God’s message from His Word.
						<ul>
							<li>The first thing in the morning works best for most people.</li>
							<li>This may mean getting up an hour (or more) earlier than you do now!</li>
						</ul>
					</li>
					<li>
						Establish a routine that centers on your devotional time. This may or may not include a
						personal diary/journal but should certainly include the use of this devotional
						diary/journal.
					</li>
					<li>
						Spend some time in prayer and, in particular, ask God to show you something from His
						Word (a lesson, a personal need, a decision, etc.). That is how He speaks to us and
						where we meet Him.
					</li>
					<li>
						If you use a devotional guide (Days of Praise, My Utmost for His Highest, Daily Bread,
						etc.), read those first to get your mind centered on spiritual things. You may find
						interesting thoughts, lesson seeds, etc., in the devotional readings—but that is <strong
							>NOT</strong
						> God speaking to you. He speaks through His Word.
					</li>
					<li>
						Read your Bible in an organized, planned way! Consider this sequence:
						<ul>
							<li>Read the Psalms passage—then spend time in prayer,</li>
							<li>Read the New Testament passage—then spend time in prayer,</li>
							<li>Read the Old Testament passage—then spend time in prayer, and finally</li>
							<li>Read the Proverbs passage—then spend time in prayer.</li>
						</ul>
					</li>
					<li>
						Don’t search to find a passage/verse that speaks to you—let God do that. As you continue
						reading, a particular verse or phrase will catch your attention. Keep reading! If this
						is what God has for you today, He will bring your mind back to it.
					</li>
					<li>
						When you believe God has spoken to you through a particular Scripture:
						<ul>
							<li>Record the reference of the passage and the words or phrase of importance.</li>
							<li>
								Record in what specific way God spoke to you by writing an “I Will” statement:
							</li>
							<ul>
								<li>If it involves a decision—make it!</li>
								<li>If it involves an action—plan it!</li>
								<li>If it requires further study—do it!</li>
								<li>If it leads to prayer—pray!</li>
							</ul>
						</ul>
					</li>
					<li>
						CAUTION: Once you have received something from the Lord, there is a tendency to revert
						to the “now I can get this done” type of reading. This is a big mistake. Often, God will
						continue to build on that which He has shown you or He may meet you with an additional
						important truth to consider.
					</li>
					<li>
						Thank God for meeting you and ask Him to remind you of the things He taught you
						throughout the day.
					</li>
				</ol>
			</main>
		</div>
	</div>
{/if}

<style>
	.college-students {
		background: url(/images/devotional.jpg);
		background-position: center;
		background-size: cover;
		width: 100%;
		min-height: 400px;
		border-radius: 12px;
		flex: 1;
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

	.readings-selector {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	h2 {
		margin-top: 48px;
		font-size: 16px;
		margin-bottom: 8px;
	}

	.titling {
		font-size: 20px;
		font-weight: 600;
		margin-top: 32px;
		margin-bottom: 4px;
	}
	p {
		margin-top: 4px;
	}
	ol > li {
		margin-bottom: 24px;
	}

	ul > li {
		margin-top: 4px;
	}
</style>
