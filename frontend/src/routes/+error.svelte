<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import '$lib/scss/styles.scss';
</script>

<div class="container">
	{#if $page.status === 404}
		<h1>{$page.status} - Page not found.</h1>
		<h4>Sorry, this URL does not exist or is no longer available.</h4>
		<button on:click={() => goto('/')}>Return to homepage</button>
	{/if}
	{#if $page.status !== 404}
		<h1>{$page.status} - Internal Server Error.</h1>
		<h4>This page isn't working</h4>
		<button on:click={() => goto($page.url.href)}>Reload</button>
	{/if}
</div>

<style lang="scss">
	.container {
		--padding-block: var(--space-7);
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		width: 100vw;
		height: 100vh;
		h1 {
			text-transform: capitalize;
			font-size: 80px;
			margin-bottom: 1rem;
		}
	}

	h4 {
		color: var(--primary-color);
	}

	button {
		margin-top: 3rem;
	}
</style>
