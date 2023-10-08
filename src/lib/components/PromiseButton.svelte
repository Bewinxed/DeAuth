<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import { fly, slide } from 'svelte/transition';

	let click_count = 0;

	let confirmTimer: ReturnType<typeof setTimeout>;

	export let confirm: number | null = null;
	export let grace: number | null = null;
	export let icon: string;
	export let show_error: boolean = false;

	let grace_remaining = grace;

	// default promise is a timeout for 2 seconds and randomly resolves or errors out
	export let promise: (e: Event) => Promise<any> = (e: Event) =>
		new Promise<void>((resolve, reject) => {
			setTimeout(() => {
				if (Math.random() > 0.5) resolve();
				else reject();
			}, 5000);
		});

	export let callback: (e: Event) => Promise<any> = () => Promise.resolve();

	let force_show_tooltip = false;
	export let tooltip = '';
	let state:
		| 'idle'
		| 'grace'
		| 'confirming'
		| 'loading'
		| 'longLoading'
		| 'success'
		| 'error' = 'idle';
	let timer: ReturnType<typeof setTimeout>;
	let delayTimer: ReturnType<typeof setTimeout> | null = null;
	let graceInterval: ReturnType<typeof setInterval> | null = null;

	$: if (state === 'confirming') {
		tooltip = 'Click again to confirm';
		confirmTimer = setTimeout(() => {
			state = 'idle';
			tooltip = '';
			force_show_tooltip = false;
		}, confirm * 1000);
		force_show_tooltip = true;
	} else {
		tooltip = '';
		force_show_tooltip = false;
	}

	$: if (click_count === 1) {
		state = 'confirming';
		tooltip = 'Click again to confirm';
		force_show_tooltip = true;
	}

	let event: Event;

	$: if (state === 'grace' && grace) {
		let graceStartTime = Date.now();
		let graceEnd = graceStartTime + grace * 1000;
		graceInterval = setInterval(() => {
			let now = Date.now();
			grace_remaining = Math.ceil((graceEnd - now) / 1000);
			if (now >= graceEnd && delayTimer) {
				clearTimeout(delayTimer);
				executeFunction(event);
			}
		}, 1000);
	} else if (graceInterval !== null) {
		clearInterval(graceInterval);
		graceInterval = null;
	}

	async function handleButtonClick(e: Event) {
		event = e;
		clearTimeout(confirmTimer);

		if (state === 'grace' && delayTimer !== null) {
			clearTimeout(delayTimer); // Clear the previous timer
			state = 'idle';
			click_count = 0;
			return;
		}

		if (confirm) {
			click_count++;
			if (click_count < 2) {
				return;
			}
		}

		if (grace) {
			state = 'grace';
			delayTimer = setTimeout(async () => {
				await executeFunction(e);
			}, grace * 1000);
		} else {
			await executeFunction(e);
		}
	}

	async function executeFunction(e: Event) {
		state = 'loading';
		timer = setTimeout(() => {
			if (state === 'loading') {
				state = 'longLoading';
				force_show_tooltip = true;
				tooltip = 'Taking longer than expected';
			}
		}, 4000);

		try {
			await promise(e).then(callback);
			clearTimeout(timer);
			state = 'success';
			// reset to idle after 2 seconds
			timer = setTimeout(() => {
				state = 'idle';
				click_count = 0;
				force_show_tooltip = false;
			}, 2000);
			click_count = 0;
			force_show_tooltip = false;
		} catch (error) {
			if (!(error instanceof Error)) {
				return;
			}
			if (e.target instanceof HTMLButtonElement && show_error) {
				const original_text = e.target.innerText;
				e.target.innerText = error.message;
				setTimeout(() => {
					if (e.target instanceof HTMLButtonElement) {
						e.target.innerText = original_text;
					}
				}, 2000);
			}
			toast.error(error.message);
			clearTimeout(timer);
			state = 'error';
			click_count = 0;
			force_show_tooltip = false;
			throw error;
		}
	}

	onMount(() => {
		state = 'idle';
		if (tooltip) {
			force_show_tooltip = true;
		}
	});
</script>

<div
	class:tooltip-open="{force_show_tooltip}"
	class:tooltip
	class:before:capitalize="{tooltip}"
	data-tip="{tooltip}"
>
	<button
		on:click="{handleButtonClick}"
		class:btn-error="{state === 'error' ||
			$$restProps.class.includes('btn-error')}"
		class:btn-success="{state === 'success' ||
			$$restProps.class.includes('btn-success')}"
		class:btn-warning="{state === 'longLoading' || state === 'grace'}"
		class:animate-shake="{state === 'error'}"
		class="{$$restProps.class
			? $$restProps.class
			: 'btn'} relative transition-all ease-in-out"
		style="--confirm-timeout: {confirm}s"
		{...$$restProps}
	>
		<div
			class:start-animation="{click_count === 1}"
			class="fill-animation rounded-lg"
		></div>

		<div>
			<figure
				class="transition-container overflow-hidden tabular-nums text-[inherit] transition-all"
			>
				{#key state}
					<span
						class:animate-spin="{state === 'loading' ||
							state === 'longLoading'}"
						in:fly|local="{{ duration: 200, x: 30, delay: 200 }}"
						out:fly|local="{{ duration: 200, x: -30 }}"
						class="text-[inherit]"
					>
						{#if state !== 'idle'}
							{#if state === 'grace' && grace}
								{#key grace_remaining}
									<span
										in:fly|local="{{ duration: 200, x: 30, delay: 200 }}"
										out:fly|local="{{ duration: 200, x: -30 }}"
									>
										{grace_remaining}
									</span>
								{/key}
							{:else if state === 'confirming'}
								<Icon icon="ri:question-line" />
							{:else if state === 'loading'}
								<Icon icon="carbon:circle-dash" />
							{:else if state === 'longLoading'}
								<Icon icon="carbon:circle-packing" />
							{:else if state === 'success'}
								<Icon icon="carbon:checkmark-outline" />
							{:else if state === 'error'}
								<Icon icon="carbon:error-outline" />
							{:else}
								<Icon {icon} />
							{/if}
						{:else if $$slots.icon}
							<slot name="icon" />
						{:else}
							<Icon
								{icon}
								class="inline"
							/>
						{/if}
					</span>
				{/key}
			</figure>
		</div>

		<div class:hidden="{!$$slots.default}"><slot /></div>
	</button>
</div>

<style>
	.fill-animation {
		position: absolute;
		top: 0;
		left: 0;
		width: 0;
		height: 100%;
		background: rgba(0, 0, 0, 0.15);
	}

	@keyframes timeout {
		0% {
			width: 0;
			opacity: 1;
		}
		80% {
			width: 100%;
			opacity: 1;
		}
		100% {
			width: 100%;
			opacity: 0;
		}
	}

	.start-animation {
		animation: timeout var(--confirm-timeout) linear;
	}

	.animate-shake {
		animation: shake 0.5s ease-in-out;
	}

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-5px);
		}
		75% {
			transform: translateX(5px);
		}
	}
</style>
