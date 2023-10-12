<script lang="ts">
	import { navigating } from '$app/stores';
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<a
	class:scale-110="{$navigating?.to?.url.toString().includes($$restProps.href)}"
	class="@container transition-all duration-100 will-change-[transform,_box-shadow]"
	{...$$restProps}
>
	<slot />
</a>
