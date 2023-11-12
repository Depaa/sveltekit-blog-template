<script lang="ts">
	import { PUBLIC_BASE_URL, PUBLIC_IMAGE_URL } from '$env/static/public';
	import RelatedPostsGrid from '$lib/components/3-grid.svelte';
	import BlogPostCard from '$lib/components/blog-post-card.svelte';
	import Seo from '$lib/components/seo/seo.svelte';
	import SocialShare from '$lib/components/social-share.svelte';
	import AuthorsCard from '$lib/components/authors-card.svelte';
	import Tag from '$lib/components/tag.svelte';
	import hljs from 'highlight.js';
	import javascript from 'highlight.js/lib/languages/javascript';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	export const dateOptions: Intl.DateTimeFormatOptions = {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	};

	onMount(() => {
		hljs.registerLanguage('javascript', javascript)
		document.querySelectorAll('pre code.hljs').forEach((el) => {
			const elCh = el.children;
   			hljs.highlightElement(el as HTMLElement);
  		});
			document.querySelectorAll('pre').forEach((el) => {
				const preChild = el.querySelector('pre.code-container') as HTMLElement;
				if(preChild) {
					el.style.display = "block";
					el.style.width = "100%";
					preChild.style.padding="20px"
					preChild.style.borderRadius="20px"
					preChild.style.border="1px solid var(--primary-color)"
					preChild.style.width="100%"
				}
			})
	});



</script>

<!-- SEO -->
<Seo
	article={true}
	title={data.post.seo.title}
	articleDescription={data.post.seo.description}
	image={data.post.image}
	tags={data.post.seo.tags || []}
	url="{PUBLIC_BASE_URL}/blog/{data.post.slug}"
	datePublished={new Date(data.post.publishedAt || data.post.createdAt).toISOString()}
	lastUpdated={new Date(data.post.updatedAt || data.post.createdAt).toISOString()}
	timeToRead={data.post.readingTime || 0}
/>

<link rel="preconnect" href={PUBLIC_BASE_URL} />
<link rel="dns-prefetch" href={PUBLIC_BASE_URL} />
<link rel="preconnect" href={PUBLIC_IMAGE_URL} />
<link rel="dns-prefetch" href={PUBLIC_IMAGE_URL} />
{#if data.post}
<article id="markdown-content">
	<div class="header">
		<h1 class="post-title">{data.post.title}</h1>
		<div class="note">
			Published on {new Date(data.post.publishedAt || data.post.createdAt).toLocaleDateString(
				'en-US',
				dateOptions
			)}
		</div>
		<div class="note">{`~ ${data.post.readingTime || 0} min read`}</div>
		<div class="tags">
			{#if data.post.tags}
				{#each data.post.tags as tag}
					<Tag>{tag}</Tag>
				{/each}
			{/if}
		</div>
	</div>
	<div class="cover-image">
		<!-- <Image path={data.post.image} filename="cover" alt="Cover Image" /> -->
		<img src={data.post.image} alt="Article cover" loading="eager" decoding="async" />
	</div>
	<div class="content blog-article-content">
		{@html data.post.content}
	</div>
	<div class="social-share">
		<SocialShare />
	</div>
	<div class="authors-list">
		<AuthorsCard authors={data.post?.authors} />
	</div>
</article>
{/if}
<div class="related-container">
	<div class="related-posts">
		<h2>Related posts</h2>
		<RelatedPostsGrid>
			{#each data.related as post}
				<BlogPostCard {post} showImage={false} onDelete={() => undefined} />
			{/each}
		</RelatedPostsGrid>
	</div>
</div>

<style lang="scss">
	.cover-image {
		padding-top: 60%;
		position: relative;
		img {
			position: absolute;
			bottom: 0;
			top: 0;
			left: 0;
			right: 0;
			width: 100%;
			height: 100%;
			object-fit: scale-down !important;
		}
	}
</style>
