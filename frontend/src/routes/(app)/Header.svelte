<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { authGuard, isLogged } from '$lib/auth/auth';
	import { PUBLIC_BASE_URL } from '$env/static/public';

	export let isLoggedIn: boolean;

	function handleLogout() {
		authGuard()
			.logout()
			.then((res) => {
				isLogged.update((state) => false);
				goto('/blog');
			})
			.catch((err) => console.error(err));
	}
</script>

<header>
	<div style="display: flex; align-items: center;">
		<a style="margin-right: 1rem; display: flex; align-items: center;" class={$page.url.pathname === '/' ? 'active-page' : ''} href="/">
			<img class="logo-home" src="{PUBLIC_BASE_URL}/logos/logo.svg" alt="Logo" style="height: 40px;"/>
		</a>
		<a class={$page.url.pathname === '/blog' ? 'active-page' : ''} href="/blog">Blog</a>
	</div>
	<div>
		{#if isLoggedIn === false}
			<a class={$page.url.pathname === '/admin/' ? 'active-page' : ''} href="/admin">Login</a>
		{/if}
		{#if isLoggedIn}
			<button on:click={handleLogout}>Logout</button>
		{/if}
	</div>
</header>

<style>
	header {
		height: 9vh;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 50px;
		background-color: var(--header-background-color);
	}

	.logo-home {
		margin-right: 0.5rem;
	}

	@media (max-width: 767px) {
		header {
			padding: 0 20px;
		}

		.logo-home {
			margin-right: 0.25rem;
		}
	}

	a:hover,
	a.active-page {
		color: var(--color-theme-1);
	}
</style>
