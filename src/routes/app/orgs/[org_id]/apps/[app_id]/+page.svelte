<script lang="ts">
	import LoginLog from './LoginLog.svelte';

	import RedirectUrls from './RedirectUrls.svelte';

	import { page } from '$app/stores';
	import { getApplication } from '$components/data_contexts.js';
	import Icon from '@iconify/svelte';
	import AuthRules from './AuthRules.svelte';
	import Roles from './Roles.svelte';
	import Secrets from './Secrets.svelte';
	import { get_svetch } from 'src/lib/context';
	const svetch = get_svetch();
	const application = getApplication();
</script>

<div class="p-4">
	<div class="flex justify-start gap-4 p-4 flex-wrap">
		<a
			href="{$page.url.pathname}/sessions"
			class="btn btn-outline"
		>
			<Icon
				icon="carbon:cloud-logging"
				class="inline"
			/>
			<span class="ml-2">Session Management</span>
		</a>
		<a
			href="{$page.url.pathname}/access_control"
			class="btn btn-outline"
		>
			<Icon
				icon="carbon:network-admin-control"
				class="inline"
			/>
			<span class="ml-2">Access Control</span>
		</a>
		<a
			href="{$page.url.pathname}/users"
			class="btn btn-outline"
		>
			<Icon
				icon="carbon:user"
				class="inline"
			/>
			<span class="ml-2">Users</span>
		</a>
	</div>
	<div class="divider"></div>
	<AuthRules id="auth-rules" />
	<div class="divider"></div>
	<Secrets id="secrets" />
	<div class="divider"></div>
	<Roles id="roles" />
	<div class="divider"></div>
	<RedirectUrls id="redirect-urls" />
	<div class="divider"></div>
	<LoginLog id="login-log" />
</div>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}
</style>
