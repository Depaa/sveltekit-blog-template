<script lang="ts">
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import { isLogged } from '$lib/auth/auth';
	import Toast from '$lib/components/toast.svelte';
	import '$lib/scss/styles.scss';
	import { addToast, toasts } from '$lib/services/toasts';
	import Header from './Header.svelte';

	let newsletterEmail = '';
	let emailRegex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

	const onChangeEmail = (event: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		newsletterEmail = (event?.currentTarget as HTMLInputElement)?.value;
	};

	async function handleSubmit() {
		try {
			const url = `${PUBLIC_BASE_URL}/api/newsletter/subscribe`;
			const data = { email: newsletterEmail };
			const params = {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
				},
				body: JSON.stringify(data),
			};
			console.debug(params);
			await fetch(url, params);
			newsletterEmail = "";
			addToast('success', 'Succesfully subscribed!');
		} catch (error) {
			console.error(error);
			addToast('error', 'Error on newsletter subscribe.');
		}
	}
</script>

<div class="app">
	<Header isLoggedIn={$isLogged} />
	<main>
		<slot />
	</main>
	<footer style="background-color: var(--card-background-color);">
		<div class="container footer-row">
			<div class="first-footer-col hide-on-mobile">
				<img style="width: 90%; border-radius: 20px" src="{PUBLIC_BASE_URL}/images/footer.jpg" alt="footer"/>
			</div>
			<div class="second-footer-col">
				<h4 style="color: var(--primary-color)">Newsletter</h4>
				<h3>Subscribe for updates</h3>
				<div class="input-footer-container">
					<form on:submit={() => handleSubmit()}>
						<input
							value={newsletterEmail}
							on:input={onChangeEmail}
							name="email"
							type="text"
							placeholder="Write here your email"
						/>
						<button disabled={!emailRegex.test(newsletterEmail)} type="submit"
							>Subscribe <i class="fa fa-paper-plane-o" /></button
						>
					</form>
				</div>
			</div>
		</div>
	</footer>
	{#each $toasts as toast}
		<Toast {toast} />
	{/each}
</div>
