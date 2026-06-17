<script lang="ts">
	import FaceBook from '$lib/assets/icons/social/facebook.svelte'
	import Instagram from '$lib/assets/icons/social/instagram.svelte';
	import LinkedIn from '$lib/assets/icons/social/linkedIn.svelte';
	import Medium from '$lib/assets/icons/social/medium.svelte';
	import MeetUp from '$lib/assets/icons/social/meetup.svelte';
	import Twitter from '$lib/assets/icons/social/twitter.svelte';
</script>

<div>
	<ul class="social-icons">
		<li class="facebook">
			<a href="https://www.facebook.com/ergomania" target="_blank"><FaceBook /></a>
		</li>
		<li class="twitter">
			<a href="https://twitter.com/rungandras" target="_blank"><Twitter /></a>
		</li>
		<li class="linkedIn">
			<a href="https://hu.linkedin.com/company/ergomania" target="_blank"><LinkedIn /></a>
		</li>
		<li class="instainstagram">
			<a href="https://www.instagram.com/ergomania_ux/" target="_blank"><Instagram /></a>
		</li>
		<li class="medium">
			<a href="https://ergomania-ux.medium.com/" target="_blank"><Medium /></a>
		</li>
		<li class="meetup">
			<a href="https://www.meetup.com/fr-FR/Product-design-talks-by-Ergomania/" target="_blank"
				><MeetUp /></a
			>
		</li>
	</ul>
</div>

<style lang="scss">
	@reference "#app.css";

	.social-icons {
		@apply flex gap-4;

		li {
			@apply cursor-pointer;
		}
	}
</style>
