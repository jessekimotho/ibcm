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
				<div class="titling">How to Use the Journal Features</div>
				<p>
					Learning to walk with God begins by meeting with God every day. This journal has a number
					of features that will help you meet with God and walk with him throughout your day. Please
					take some time to read about all the features and begin to use them in your Meetings with
					God.
				</p>

				<h2>Agenda and Notes with Appointment Calendar</h2>
				<p>
					The most common feature of any diary is the appointment calendar used for recording and
					remembering meetings and appointments. The Bible says, “Let all things be done decently
					and in order.” (I Cor. 14:40) Believers should use their time wisely and for the Lord. As
					you make your plans for the day, pray and yield your activities to Him and ask for
					guidance and wisdom in planning your day. Additional suggestions can be found on the
					Listening-Yielding Helps page (228).
				</p>

				<h2>Weekly Memory Verse</h2>
				<p>
					Memorizing verses is an exercise that contributes to the spiritual discipline of
					meditating on God’s Word. We cannot think on God’s Word if it is not memorized. Take time
					each day to read the memory verse five times. By the end of the week, you should have it
					memorized. Another suggestion is to write out the verse once every day. This will aid you
					in hiding God’s Word in your heart. (Psalm 119:11) A notice is included above the Bible
					reading schedule to remind you to review the memory verse each day. The theme for the
					memory verses is abiding in the presence of God.
				</p>

				<h2>Accountability and Communication</h2>
				<p>
					One of the important principles for victorious living is accountability. Accountability
					means that you place yourself under authority and allow others to confront and correct you
					if you are not doing what you ought to do. The Bible says, “Submitting yourselves one to
					another in the fear of God.” (Ephesians 5:21) As believers, your first accountability is
					to your local church. This feature in the devotional journal reminds you to communicate
					with your pastor about any needs or help you need in your ministry and to inform him if
					you are unable to perform your ministry because of circumstantial conflicts. Another form
					of accountability is to a prayer partner. Believers should agree to voluntarily submit one
					to another to encourage and challenge each other to consistent devotional habits and to
					faithfully pray for one another. Find someone to be your personal, daily prayer and
					accountability partner.
				</p>

				<h2>Weekly Outreach Reminder</h2>
				<p>
					Jesus said, “Ye are the salt of the earth:” and “Ye are the light of the world.” (Matthew
					5:13-14) These statements mean that believers should influence and impact the world with
					Gospel truth. You ought to be looking for opportunities to share your faith every day and
					in every situation. This feature in the devotional journal is intended to remind you to
					look for opportunities to spread the Gospel through giving out Gospel tracts and talking
					to others about salvation. You are also reminded to influence other believers by
					communicating how to live in obedience to the Scriptures through teaching discipleship
					lessons. Accept the challenge of the weekly outreach reminder to be salt and light in your
					community.
				</p>

				<h2>Bible Reading Schedule</h2>
				<p>
					The Bible reading schedule in this journal offers six different passages of Scripture to
					read each day. This feature provides a variety of choices so each journal user can
					customize his/her own reading plan. Some may read one or two passages a day if they are
					just beginning the practice of meeting with God. Others may read four passages a day which
					would enable them to read through the Bible in two years, while still others may read all
					six passages and read through the Bible in a single year. Develop your own Bible reading
					plan by choosing the passages from this schedule.
				</p>

				<h2>Bible Reading Journal</h2>
				<p>
					An important exercise in learning to walk with God is that of writing down God’s message
					for you each day in your devotional journal. The act of writing is an exercise that helps
					you remember, and through writing you also make a permanent record of your meeting with
					God. You can review your thoughts by writing in your journal.
				</p>

				<h2>I Will Statement</h2>
				<p>
					Every time you read the Bible, God wants you to do something with it. The “I Will”
					Statement is a device to clearly and definitely write out what you intend to do as a
					result of your daily Bible Reading. Refer to the instruction given in the section “Meeting
					God in His Word” on page 7, #8b. The “I Will Statement” brings you to a place of yielding
					and surrender to God each day.
				</p>

				<h2>Focus on God</h2>
				<p>
					The Focus on God section of the devotional journal presents a name or attribute of God
					that you can meditate upon as you begin your prayer time by praising Him for that
					characteristic. By meditating and focusing on God, you take the focus off of self and
					prepare your heart and attitude for meeting with God.
				</p>

				<h2>Develop your own Prayer List</h2>
				<p>
					The instruction in the section “Meeting God through Prayer” (pages 8-9) will help you to
					begin to develop your prayer list. Space is provided for writing a prayer list on pages
					10-11. As you grow in your prayer life, your prayer list will also grow. Purchase a
					notebook and divide it into sections for the different forms of prayer and add your
					requests. As your prayer life continues to grow, you may want to add additional forms of
					prayer found in the section “The Hour that Changes the World” (pages 12-13). By using a
					prayer list, you will find that you will pray longer, your will pray more consistently,
					and you will remember important requests for which to pray that otherwise you may forget.
					Your prayer list is the place to record your requests and personal meetings with God.
				</p>

				<p>
					Additional helps and suggestions are found on the following pages. Also, on the pages
					opposite the monthly calendar pages; other helps for the forms of prayer are included.
				</p>
			</main>
		</div>
	</div>
{/if}

<style>
	.college-students {
		background: url(/images/phone.jpg);
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
</style>
