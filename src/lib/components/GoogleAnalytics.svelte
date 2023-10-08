<script lang="ts">
	import { page } from '$app/stores';

	$: {
		// @ts-expect-error ignore this, ganalytics
		if (typeof gtag !== 'undefined') {
			// @ts-expect-error ignore this, ganalytics
			gtag('config', 'G-914DZTMXZC', {
				page_title: document.title,
				page_path: $page.url.pathname
			});
			// if there is a user session
			// @ts-expect-error ignore this, ganalytics
			if (page.data.session.user) {
				// @ts-expect-error ignore this, ganalytics
				gtag('set', { user_id: page.data.session.user.userId });
			}
		}
	}
</script>

<svelte:head>
	<script
		async
		src="https://www.googletagmanager.com/gtag/js?id=MEASUREMENT_ID"
	>
	</script>
	<script>
		window.dataLayer = window.dataLayer || [];

		function gtag() {
			dataLayer.push(arguments);
		}

		gtag('js', new Date());
		gtag('config', 'G-914DZTMXZC');
	</script>
</svelte:head>
