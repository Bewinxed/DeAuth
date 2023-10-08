<script lang="ts">
	import { getApplication } from '$components/data_contexts';
	import { get_svetch } from 'src/lib/context';
	import SecretField from './SecretField.svelte';
	import PrettyIcon from '$components/PrettyIcon.svelte';

	const application = getApplication();

	let access_token_secret: string | null = $application.access_token_secret;
	let refresh_token_secret: string | null = $application.refresh_token_secret;

	let show_refresh_token = false;
	let show_access_token = false;
</script>

<header
	id={$$restProps.id}
	class="flex place-content-start place-items-center justify-between gap-2 p-4"
>
	<div class="flex flex-col place-content-start place-items-start gap-2">
		<div class="flex place-content-start place-items-center gap-2">
			<PrettyIcon icon="carbon:ibm-cloud-key-protect"></PrettyIcon>
			<h1 class="text-xl font-bold">Access Tokens</h1>
		</div>
		<p class="text-sm italic">
			Find below the access tokens for your application, You can use these tokens to access the API
		</p>
	</div>
	<!-- <figure class="w-4 h-4 inline text-base-content"><Icon icon="carbon:chevron-right" class="h-4 w-4"></Icon></figure> -->
</header>
<div class="p-4">
	<div class="form-control gap-2">
		<SecretField
			id="access_token_secret"
			title="access token"
			bind:value={access_token_secret}
			bind:show={show_access_token}
		></SecretField>
		<SecretField
			id="refresh_token_secret"
			title="refresh token"
			bind:value={refresh_token_secret}
			bind:show={show_refresh_token}
		></SecretField>
	</div>
</div>
