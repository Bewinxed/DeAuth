<script lang="ts">
	import { getApplication } from '$components/data_contexts';
	import { get_svetch } from 'src/lib/context';
	import SecretField from './SecretField.svelte';
	import PrettyIcon from '$components/PrettyIcon.svelte';
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	import { slide } from 'svelte/transition';

	const application = getApplication();

	let access_token_secret: string | null = $application.access_token_secret;
	let refresh_token_secret: string | null = $application.refresh_token_secret;

	let show_refresh_token = false;
	let show_access_token = false;

	let show_instructions = false;

	let customize_branding = false;
</script>

<header
	id="{$$restProps.id}"
	class="flex place-content-start place-items-center justify-between gap-2 p-4"
>
	<div class="flex flex-col place-content-start place-items-start gap-2">
		<div class="flex place-content-start place-items-center gap-2">
			<PrettyIcon icon="carbon:ibm-cloud-key-protect"></PrettyIcon>
			<h1 class=" text-xl font-bold">Access Tokens</h1>
		</div>
		<p class="text-sm italic">
			Find below the access tokens for your application, You can use these
			tokens to access the API
		</p>
	</div>
	<!-- <figure class="w-4 h-4 inline text-base-content"><Icon icon="carbon:chevron-right" class="h-4 w-4"></Icon></figure> -->
</header>
<div></div>
<div class="p-4">
	<div class="form-control gap-2">
		<SecretField
			id="access_token_secret"
			title="access token"
			bind:value="{access_token_secret}"
			bind:show="{show_access_token}"
		></SecretField>
		<SecretField
			id="refresh_token_secret"
			title="refresh token"
			bind:value="{refresh_token_secret}"
			bind:show="{show_refresh_token}"
		></SecretField>
	</div>
	<div class="divider"></div>
	<h2 class="mb-2 text-lg font-semibold">Use this in your application!</h2>
	<button
		on:click="{() => (show_instructions = !show_instructions)}"
		class="chonk btn btn-info btn-sm text-white">Show Instructions</button
	>
	{#if show_instructions}
		<div
			transition:slide="{{ axis: 'y' }}"
			class="flex flex-col gap-2"
		>
			<ul class="steps steps-vertical">
				<li class="step step-primary">
					<div class="text-start">
						<p class="font-semibold">
							<Icon icon="carbon:number-one"></Icon> Install the SDK
						</p>
						<div class="mockup-code">
							<pre data-prefix="$"><code>[npm/bun] i @deauth/sdk-universal</code
								></pre>
							<pre
								data-prefix=">"
								class="text-warning"><code>installing...</code></pre>
							<pre
								data-prefix=">"
								class="text-success"><code>Done!</code></pre>
						</div>
					</div>
				</li>
				<li class="step step-primary">
					<div class="text-start">
						<p class="font-semibold">
							<Icon icon="carbon:number-one"></Icon> Initiate the SDK
						</p>
						<div class="mockup-code">
							<pre><code
									><span class="text-secondary">import</span> <span
										class="text-info">DeAuth</span
									><span class="text-secondary"> from</span> <span
										class="text-yellow">'@deauth/sdk-universal'</span
									>
							</code>
	<code
									><span class="text-secondary">export const</span> <span
										class="text-success">deAuth</span
									><span class="text-secondary"> = new</span> <span
										class="text-info">DeAuth</span
									>( </code>
		<code class="text-yellow"
									>'{$page.params.app_id}' <span class="text-gray-500"
										>//App ID</span
									></code
								>
		<code class="text-yellow"
									>'{$application.redirect_urls[0]?.url ??
										'http://127.0.0.1'}',  <span class="text-gray-500"
										>//Redirect URI</span
									></code
								>
		<code class="text-yellow"
									>'{$application.access_token_secret}', <span
										class="text-gray-500">//Access Token</span
									></code
								>
		<code class="text-yellow"
									>'{$application.refresh_token_secret}', <span
										class="text-gray-500">//Refresh Token</span
									></code
								>

						</pre>
						</div>
					</div>
				</li>
				<li class="step step-primary">
					<div class="text-start">
						<p class="font-semibold">
							<Icon icon="carbon:number-two"></Icon> Redirect to OAuth
						</p>
						<div class="mockup-code">
							<pre><code
									><span class="text-secondary">const</span> <span
										class="text-success">authorization_url</span
									><span class="text-secondary"> = await</span> <span
										class="text-info">deAuth</span
									><span class="text-secondary">{'.redirectToOAuth({'}</span>
</code><code>	<span class="text-success">fetchInstance</span><span
										class="text-secondary">:</span
									> <span class="text-info">fetch</span></code
								>
	<code
									><span class="text-secondary">{'}'})</span>
							</code>
						</pre>
						</div>
					</div>
				</li>
				<li class="step step-primary">
					<div class="text-start">
						<p class="font-semibold">
							<Icon icon="carbon:number-two"></Icon> Validate Session
						</p>
						<div class="mockup-code">
							<pre><code
									><span class="text-secondary">const</span> <span
										class="text-success">session</span
									><span class="text-secondary"> = await</span> <span
										class="text-info">deAuth</span
									><span class="text-secondary">{'.handleRedirect({'}</span
									></code
								><code>	<span class="text-success">proof</span><span
										class="text-secondary">:</span
									> <span class="text-info">proof</span></code
								><code
									><span class="text-secondary">{'}'})</span>
							</code>
						</pre>
						</div>
					</div>
				</li>
				<li class="step step-primary">
					<div class="text-start">
						<p class="font-semibold">
							<Icon icon="carbon:number-two"></Icon> Get User
						</p>
						<div class="mockup-code">
							<pre><code
									><span class="text-secondary">const</span> <span
										class="text-success">session</span
									><span class="text-secondary"> = await</span> <span
										class="text-info">deAuth</span
									><span class="text-secondary">{'.getSessionUser({'}</span
									></code
								><code>	<span class="text-success">session_id</span><span
										class="text-secondary">:</span
									> <span class="text-info">'Get From Cookie'</span></code
								><code
									><span class="text-secondary">{'}'})</span>
							</code>
						</pre>
						</div>
					</div>
				</li>
			</ul>
		</div>
	{/if}
</div>
