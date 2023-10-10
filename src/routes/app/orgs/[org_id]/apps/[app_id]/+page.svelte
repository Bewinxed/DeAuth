<script lang="ts">
	import LoginLog from './LoginLog.svelte';

	import RedirectUrls from './RedirectUrls.svelte';

	import { page } from '$app/stores';
	import { getApplication } from '$components/data_contexts.js';
	import Icon from '@iconify/svelte';
	import { get_svetch } from 'src/lib/context';
	import AuthRules from './AuthRules.svelte';
	import InviteUser from './InviteUser.svelte';
	import ModalButton from './ModalButton.svelte';
	import Secrets from './Secrets.svelte';
	const svetch = get_svetch();
	const application = getApplication();
</script>

<div class="p-4">
	<div class="flex flex-wrap justify-start gap-4 p-4">
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
			href="{$page.url.pathname}/members"
			class="btn btn-outline"
		>
			<Icon
				icon="carbon:user"
				class="inline"
			/>
			<span class="ml-2">Members</span>
		</a>
		<!-- invite users -->
		<ModalButton
			icon="carbon:user"
			item_name="invite"
			class="btn btn-outline"
		>
			<Icon
				icon="carbon:send"
				class=" inline"
			/>
			Invite Users
			<svelte:fragment slot="modal">
				<InviteUser/>
			</svelte:fragment>
		</ModalButton>
	</div>
	<div class="divider"></div>
	<AuthRules id="auth-rules" />
	<div class="divider"></div>
	<Secrets id="secrets" />
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
