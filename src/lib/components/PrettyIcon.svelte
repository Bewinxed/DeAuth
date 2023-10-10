<script lang="ts">
	import Icon from '@iconify/svelte';
	export let icon: string;
	export let figure_class: string = 'bg-neutral';
	export let inner_class: string = 'bg-base-100';
	export let icon_class: string = 'bg-neutral';
	export let size: 'small' | 'medium' | 'large' = 'large';

	interface Sizes {
		[key: string]: {
			figure: {
				size: string;
				padding: string;
				roundness: string;
			};
			inner: {
				size: string;
				padding: string;
				roundness: string;
			};
			icon: {
				size: string;
				padding: string;
				roundness: string;
			};
		};
	}

	let sizes: Sizes = {
		small: {
			figure: { size: 'h-6 w-6', padding: 'p-0', roundness: 'rounded-md' },
			inner: {
				size: 'h-5 w-5',
				padding: 'p-0',
				roundness: 'rounded-md`'
			},
			icon: {
				size: 'h-full w-full',
				padding: 'p-0',
				roundness: 'rounded-sm'
			}
		},
		medium: {
			figure: { size: 'h-10 w-10', padding: 'p-0.5', roundness: 'rounded-lg' },
			inner: {
				size: 'h-8 w-8',
				padding: 'p-0.5',
				roundness: 'rounded-md'
			},
			icon: {
				size: 'h-full w-full',
				padding: 'p-1',
				roundness: 'rounded-md'
			}
		},
		large: {
			figure: { size: 'h-12 w-12', padding: 'p-0.5', roundness: 'rounded-xl' },
			inner: {
				size: 'h-10 w-10',
				padding: 'p-1',
				roundness: 'rounded-lg'
			},
			icon: {
				size: 'h-8 w-8',
				padding: 'p-1',
				roundness: 'rounded-md'
			}
		}
	};
</script>

<figure
	class="inline-flex {sizes[size].figure
		.size} place-content-center place-items-center {sizes[size].figure
		.roundness} border {sizes[size].figure.padding} shadow-lg {figure_class}"
>
	<div
		class="inline-flex {sizes[size].inner.size} {sizes[size].inner.roundness}
		 place-content-center place-items-center {sizes[size].inner
			.padding} shadow-2xl {inner_class}"
	>
		<div
			class="inline-flex {sizes[size].icon
				.size} place-content-center place-items-center bg-base-100 {sizes[size]
				.icon.padding} text-neutral-content shadow-lg {icon_class} {sizes[size]
				.icon.roundness}"
		>
			<Icon
				{icon}
				class="inline h-full w-full"
			/>
		</div>
	</div>
</figure>
