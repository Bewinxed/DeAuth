<script lang="ts">
	import Icon from '@iconify/svelte';
	import { fly } from 'svelte/transition';
	import PrettyIcon from './PrettyIcon.svelte';
	import { tweened } from 'svelte/motion';
	import { Toaster } from 'svelte-french-toast';
	export let item_name: string;
	export let icon: string;
	export let title: string | undefined = undefined;
	let modal: HTMLDialogElement;
	export let open = true;
	$: if (modal && open) {
		modal.showModal();
	} else if (modal) {
		modal.close();
	}

	const height = tweened(0, {
		delay: 100
	});
	const movedY = tweened(0, {
		delay: 100
	});

	export function swipeToClose(node: HTMLElement) {
		let touchStartY: number;
		let currentY: number;

		const setModalPosition = (y: number) => {
			// node.style.transform = `translateY(${y/2}px)`;
		};

		const setModalHeight = (y: number) => {
			node.style.height = `${$height - y}px`;
		};

		const handleTouchStart = (e: TouchEvent) => {
			touchStartY = e.touches[0].clientY;
			$height = node.getBoundingClientRect().height;
			node.style.transition = 'none'; // Disable transition for smooth dragging
		};

		const handleTouchMove = (e: TouchEvent) => {
			currentY = e.touches[0].clientY;
			$movedY = currentY - touchStartY;

			// Elastic effect for vertical move
			// const elasticMove = Math.sign(movedY) * Math.min(Math.abs(movedY), Math.abs(movedY) * 0.6);

			// setModalPosition($movedY);
			setModalHeight($movedY); // Change the height based on drag distance
		};

		const handleTouchEnd = () => {
			$movedY = currentY - touchStartY;

			// Enable transition for smooth return
			// node.style.transition = 'transform 0.3s ease-out';

			// Force reflow
			// void node.offsetHeight;

			if (Math.abs($movedY) > 100) {
				const closeEvent = new CustomEvent('close', {
					bubbles: true
				});
				node.dispatchEvent(closeEvent);
				// setModalPosition(0);
			} else {
				// Reset modal position if not swiped too far
				setModalPosition(0);
				// console.log(`position`, node.offsetHeight);
			}
		};

		node.addEventListener('touchstart', handleTouchStart, {
			passive: true
		});
		node.addEventListener('touchmove', handleTouchMove, {
			passive: true
		});
		node.addEventListener('touchend', handleTouchEnd, {
			passive: true
		});

		return {
			destroy() {
				node.removeEventListener('touchstart', handleTouchStart);
				node.removeEventListener('touchmove', handleTouchMove);
				node.removeEventListener('touchend', handleTouchEnd);
			}
		};
	}

	function customListener(node: Node, p) {
		node.addEventListener(p.on, p.do);
		return { destroy: () => node.removeEventListener(p.on, p.do) };
	}
</script>

<dialog
	id="modal"
	use:customListener="{{ on: 'close', do: () => (open = false) }}"
	on:close="{() => (open = false)}"
	class="modal modal-bottom transition-opacity duration-300 sm:modal-middle"
	bind:this="{modal}"
	aria-hidden="true"
>
	{#if open}
		<Toaster />
		<div
			use:swipeToClose
			in:fly="{{ x: 0, y: 100, duration: 200, delay: 200 }}"
			out:fly="{{ x: 0, y: -100, duration: 200 }}"
			class="modal-box flex flex-col p-0"
		>
			<div
				class="flex place-content-start place-items-center justify-between gap-4 border p-4"
			>
				<div class="flex place-content-start place-items-center gap-4">
					<PrettyIcon {icon}></PrettyIcon>
					<h1 class=" text-xl font-bold">
						{title ? title : `Create ${item_name}`}
					</h1>
				</div>
				<button
					class="btn btn-square btn-ghost btn-sm"
					on:click="{() => {
						open = false;
					}}"
				>
					<Icon
						icon="carbon:close"
						class="h-6 w-6"
					></Icon>
				</button>
			</div>
			<div
				on:touchmove|stopPropagation
				class="p-4 shadow-inner"
			>
				<slot />
			</div>
			{#if $$slots.action}
				<div class="modal-action p-4">
					<slot name="action" />
				</div>
			{/if}
		</div>
	{/if}
</dialog>
