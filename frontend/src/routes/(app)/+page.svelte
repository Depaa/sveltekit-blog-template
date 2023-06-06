<script lang="ts">
	import { PUBLIC_BASE_URL, PUBLIC_IMAGE_URL, PUBLIC_LOGO_URL } from '$env/static/public';
	import RecentPostGrid from '$lib/components/2-grid.svelte';
	import BlogPostCard from '$lib/components/blog-post-card.svelte';
	import RecentPostSection from '$lib/components/recent-post-section.svelte';
	import Seo from '$lib/components/seo/seo.svelte';
	import Socials from '$lib/components/socials.svelte';
	export let data;
	const { items } = data;

	const completeHeroString = "Hello I'm Matteo!";
	let heroString = '';
	let i = 0;

	var refreshIntervalId = setInterval(() => {
		if (i < completeHeroString.length) {
			heroString = heroString + completeHeroString[i];
			i++;
		} else {
			clearInterval(refreshIntervalId);
		}
	}, 200);
</script>

<Seo
	image="{PUBLIC_BASE_URL}/logos/logo-complete-black.png"
	url={PUBLIC_BASE_URL}
	title={undefined}
	articleDescription={undefined}
	datePublished={undefined}
	lastUpdated={undefined}
	timeToRead={0}
	tags={[]}
/>

<link rel="preconnect" href={PUBLIC_BASE_URL} />
<link rel="dns-prefetch" href={PUBLIC_BASE_URL} />
<link rel="preconnect" href={PUBLIC_IMAGE_URL} />
<link rel="dns-prefetch" href={PUBLIC_IMAGE_URL} />

<div
	style="padding: 0 20px; display: flex; align-items: center; justify-content: center; z-index: -1; right: 0; left: 0; text-align: center; min-height: 40vh;
	background: #fff; color: var(--secondary-color-contrast);"
>
	<section id="hero">
		<h1 class="hero-h1">{heroString}</h1>
		<br />
		<div class="socials-hero">
			<p>Follow me on:</p>
			<Socials />
		</div>
	</section>
</div>
<div class="container">
	<section id="recent-posts">
		<RecentPostSection>
			<RecentPostGrid>
				{#each items as post}
					<BlogPostCard {post} showImage={false} isAdmin={false} onDelete={() => undefined} />
				{/each}
			</RecentPostGrid>
		</RecentPostSection>
	</section>
</div>

<style lang="scss">
	#hero {
		max-width: 100%;
		h1 {
			overflow: hidden; /* Ensures the content is not revealed until the animation */
			border-right: 0.15em solid orange; /* The typwriter cursor */
			white-space: break-spaces; /* Keeps the content on a single line */
			margin: 0 auto; /* Gives that scrolling effect as the typing happens */
			letter-spacing: 0.15em; /* Adjust as needed */
			animation: blink-caret 0.75s step-end infinite;
		}
		@media (max-width: 967px) {
			h1 {
				letter-spacing: 0;
			}
		}
		.socials-hero {
			p {
				margin-bottom: 0.5rem;
			}
			animation: 6.5s ease 0s normal forwards 1 fadein;
		}
	}
	@keyframes fadein {
		0% {
			opacity: 0;
		}
		66% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	/* The typewriter cursor effect */
	@keyframes blink-caret {
		from,
		to {
			border-color: transparent;
		}
		50% {
			border-color: var(--primary-color);
		}
	}
</style>
