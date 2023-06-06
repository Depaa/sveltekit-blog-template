<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="social-share-container">
	<p>Share this article on:</p>
	<div class="socials">
		<a
			href="https://facebook.com/sharer/sharer.php?u={$page.url.href}"
			target="_blank"
			rel="noreferrer"
			aria-label="Share on Facebook"
		>
			<i class="fa fa-facebook" />
		</a>
		<a
			href="https://twitter.com/intent/tweet/?url={$page.url.href}"
			target="_blank"
			rel="noreferrer"
			aria-label="Share on Twitter"
		>
			<i class="fa fa-twitter" />
		</a>
		<a
			href="https://www.linkedin.com/sharing/share-offsite/?url={$page.url.href}"
			target="_blank"
			rel="noreferrer"
			aria-label="Share on Linkedin"
		>
			<i class="fa fa-linkedin" />
		</a>
		<a
			href="https://reddit.com/submit/?url={$page.url.href}"
			target="_blank"
			rel="noreferrer"
			aria-label="Share on facebook"
		>
			<i class="fa fa-reddit" />
		</a>
		<a
			href="https://api.whatsapp.com/send/?text={$page.url.href}"
			target="_blank"
			rel="noreferrer"
			aria-label="Share on Whatsapp"
		>
			<i class="fa fa-whatsapp" />
		</a>
	</div>
</div>

<style lang="scss">
	.social-share-container {
		display: flex;
		justify-content: right;
		flex-direction: column;
		p {
			text-align: right;
			margin-bottom: 20px;
		}
		.socials {
			display: flex;
			justify-content: right;
			gap: 20px;
		}
		.fa {
			font-size: 30px;
		}
	}
</style>
