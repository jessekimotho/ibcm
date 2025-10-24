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
				<div class="titling">Meeting God Through Prayer</div>

				<p>
					Prayer is an important aspect of one’s devotional life. Someone has defined prayer as
					talking with God. Though prayer includes making requests to God, there are other ways to
					talk with God. The acrostic PRAY presents four forms of talking with God that we should
					include in our prayers.
				</p>

				<h2>P - Praise</h2>
				<p>
					<strong>What is it?</strong>
					<br />
					Praise is a command of God. “Let everything that hath breath praise the Lord. Praise ye the
					Lord.” (Psalm 150:6) “Enter into his gates with thanksgiving, and into his courts with praise.”
					(Psalm 100:4).
				</p>
				<p>
					<strong>How do you do it?</strong>
					<br />
				</p>
				<ol>
					<li>
						Bow on your knees (if you can) as a sign of humility. Clear your mind of thoughts that
						would crowd out God. Ask the Holy Spirit to be your Helper in prayer.
					</li>
					<li>Read one of the praise Psalms 145-150. These will prepare your heart for praise.</li>
					<li>
						Praise is verbal! Always use your tongue to praise Him! The heart does not have to feel
						praise. The emotions normally follow after obedience. Use words meaningfully like:
						Praise the Lord; Hallelujah; Thank you, Lord; Amen; Glory; etc.
					</li>
					<li>
						Focus on the character quality of God (his attributes). This prepares your heart to be
						aligned with God’s priorities. Focus on the eight compound names of God (Jehovah) that
						reveal Himself as the eternal and self-existent God, and His sufficiency to his people.
						He will be what we need Him to be. Jesus Christ is the fulfillment of all these names
						(Philippians 2:9-11). Your Devotional Journal has names and attributes of God for you to
						focus upon.
					</li>
				</ol>

				<h2>R - Repent</h2>
				<p>
					<strong>What is it?</strong>
					<br />
					Repentance is a change of mind with regard to sin and Christ. Sin is the leading cause of unanswered
					prayer (Psalm 66:18). Everyone is convicted in some degree when they sin. God wants you to
					turn from sin through confession and trust the power of the blood of Jesus to cleanse you (I
					John 1:7-10).
				</p>
				<p>
					<strong>What are you to do?</strong>
					<br />
				</p>
				<ol>
					<li>
						Forgive as often as you want to be forgiven (Matthew 6:12, 14-15). If you are unwilling
						to forgive others of their sins toward you, God is unwilling to forgive you of your sins
						toward Him (Mark 11:24-26). Jesus told Peter to forgive as often as he is offended
						because that is how many times God is ready and willing to forgive us. Our sins toward
						God are far greater than the sins of others toward us (Matthew 18:23-25).
					</li>
					<li>
						Ask God to forgive you. Name your sins to God. Tell Him exactly what you’ve done. Be
						totally honest and transparent. Be specific! Know the list of specific sins in the Bible
						and judge yourself in the light of them. Do not plead ignorance as an excuse. Do not let
						past sins that have been confessed surface in your mind. The devil will use this to keep
						you in an attitude of defeat. There is no condemnation to them that are in Christ Jesus
						(Romans 8:1).
					</li>
					<li>
						Confess your weakness to God. Ask the Holy Spirit to help you through the day not to
						fall. We are prone to certain sins. Prepare your heart not to give in when the
						temptation comes (Daniel 1:8). Reckon yourself dead to sin because of your union with
						Christ (Romans 6:1-11). Ask God to give you a fresh understanding of Calvary (Isaiah
						53:4-6). This will help you to hate your own sins and see that others’ sins toward you
						are minimal in comparison.
					</li>
				</ol>

				<h2>A - Ask</h2>
				<p>
					<strong>What is it?</strong>
					<br />
					Asking involves making requests to God for definite needs in your life and the lives of others
					(Matthew 7:7). The word “ask” means to crave, to desire, or to call for something. Prayer is
					God’s ordained means of obtaining His blessings (James 4:2).
				</p>
				<p>
					<strong>How do you ask?</strong>
					<br />
				</p>
				<ol>
					<li>Make a written prayer list for yourself and others – daily and weekly.</li>
					<li>Write down promises from God’s Word beside the request.</li>
					<li>Claim the promises of God for that particular person or need.</li>
					<li>Thank Him that He is going to fulfill His Word.</li>
				</ol>

				<h2>Y - Yield</h2>
				<p>
					<strong>What is it?</strong>
					<br />
					Yielding is putting your life at God’s disposal (Romans 6:13). It involves surrendering your
					life to God for today. God expects us to live one day at a time (Matthew 6:11, 34).
				</p>
				<p>
					<strong>How do you yield?</strong>
					<br />
				</p>
				<ol>
					<li>
						It is a one-time decision that has lifelong effects (Romans 12:1). Christ becomes the
						Lord over your life. He has been given the right to rule, and you are simply His
						servant, doing His will. Your decision should lead you into a life of faith.
					</li>
					<li>
						Every day I must make an active decision with my will to yield to God. I should tell God
						that I want His will for my life in every area. I give Him the things that I have to do
						today. I surrender myself to the authority God has placed over me (I Samuel 15:22-23;
						Ephesians 5:17).
					</li>
					<li>
						Tell the Lord He has the right to bring into your life what He wants for today. Give
						your schedule to God.
					</li>
					<li>
						Be willing to accept and do the things you don’t want to do. Even our Lord Jesus faced
						things that were very difficult for Him to do (Matthew 26:39).
					</li>
					<li>If you sin, quickly confess it and put the Lord back on the throne of your life.</li>
				</ol>

				
				<div class="readings-selector">
					<div class="hour mt-8"></div>
				</div>
			</main>
		</div>
	</div>
{/if}

<style>
	.college-students {
		background: url(/images/pray.jpg);
		background-position: center;
		background-size: cover;
		width: 100%;
		min-height: 400px;
		border-radius: 12px;
		flex: 1;
	}

	.hour {
		background: url(/images/hour.png);
		background-color: white;
		background-position: center;
		background-size: contain;
		background-repeat: no-repeat;
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
		margin-top: 40px;
		padding-top: 32px;
		font-size: 16px;
		margin-bottom: 24px;
		border-top: 1px solid #ffffff42;
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
		margin-bottom: 8px;
	}

	strong {
		font-size: 16px;
		padding-top: 12px;
		display: flex;
		margin-bottom: -12px;
	}
</style>
