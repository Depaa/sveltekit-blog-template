<script lang="ts">
	import website from '$lib/config/website';
	const VERTICAL_LINE_ENTITY = '\u007c'; // |

	const { author, ogLanguage, siteTitle, twitterUsername, description, keywords } = website;

	export let article = false;
	export let datePublished: string | undefined;
	export let lastUpdated: string | undefined;
	export let image: string | undefined;
	export let articleDescription: string | undefined;
	export let url: string;
	export let timeToRead = 0;
	export let title: string | undefined;
	export let tags: string[] = [];
</script>

<!-- SEO -->
<svelte:head>
	{#if article}
		<!-- title -->
		<title>{siteTitle} {VERTICAL_LINE_ENTITY} {title}</title>
		<meta name="title" property="og:title" content="{siteTitle} {VERTICAL_LINE_ENTITY} {title}" />
		<meta name="twitter:title" content="{siteTitle} {VERTICAL_LINE_ENTITY} {title}" />
		<!-- description -->
		<meta name="description" property="og:description" content={articleDescription} />
		<meta name="description" content={articleDescription} />
		<meta name="twitter:description" content={articleDescription} />
		<!-- keywords -->
		<meta name="keywords" content={tags.join(', ')} />
		<!-- twitter -->
		<meta name="twitter:label1" content="Written by" />
		<meta name="twitter:data1" content={author} />
		{#if timeToRead > 0}
			<meta name="twitter:label2" content="Est. reading time" />
			<meta
				name="twitter:data2"
				content={timeToRead !== 1 ? `${timeToRead} minutes` : '1 minute'}
			/>
		{/if}
		<!-- date -->
		{#if datePublished}
		<meta name="published_time" property="article:published_time" content={datePublished} />
		<meta property="article:published_time" content={datePublished} />
		{/if}
		{#if lastUpdated}
			<meta property="article:modified_time" content={lastUpdated ? lastUpdated : datePublished} />
		{/if}
	{:else}
		<!-- title -->
		<title>{siteTitle}</title>
		<meta name="title" property="og:title" content={siteTitle} />
		<meta name="twitter:title" content={siteTitle} />
		<!-- description -->
		<meta name="description" property="og:description" content={description} />
		<meta name="description" content={description} />
		<meta name="twitter:description" content={description} />
		<!-- keywords -->
		<meta name="keywords" content={keywords.join(', ')} />
	{/if}

	<!-- general -->
	<meta property="og:site_name" content={siteTitle} />
	<meta property="og:locale" content={ogLanguage} />
	<meta property="og:url" content={url} />
	<meta property="og:type" content={article ? 'article' : 'website'} />
	<meta
		name="robots"
		content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
	/>
	<!-- author -->
	<meta name="author" content={author} />
	<meta property="article:author" content={author} />
	<meta name="author" property="article:author" content={author}/>
	<link rel="canonical" href={url} />

	<!-- images -->
	{#if image}
		<meta name="image" property="og:image" content={image} />
		<meta property="og:image:alt" content="Cover image." />
		<meta name="twitter:image" content={image} />
	{/if}
	<!-- TODO: have a placeholder image, like the logo -->

	<!-- twitter -->
	<meta name="twitter:creator" content={`@${twitterUsername}`} />
	<meta name="twitter:site" content={`@${twitterUsername}`} />
</svelte:head>
