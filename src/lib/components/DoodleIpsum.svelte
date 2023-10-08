<script lang="ts">
	export let width: number | null = 200;
	export let height: number | null = 200;
	export let category:
		| 'random'
		| 'flat'
		| 'handdrawn'
		| 'outline'
		| 'abstract'
		| 'avatar'
		| 'avatar 2'
		| 'avatar 3'
		| 'avatar 4'
		| 'avatar 5';
	('random');
	export let cache = true;
	export let cacheBust: number | null = cache ? null : Math.random();
	export let bgColor: string | null = null;
	export let shape: string | null = null;
	export let saturation: string | null = null;
	export let blur: string | null = null;

	let imgUrl: string = `https://doodleipsum.com/${width || ''}x${height || ''}/${category.replace(' ', '-')}`;
	let queryParams: string[] = [];

	if (bgColor) queryParams.push(`bg=${bgColor}`);
	if (shape) queryParams.push(`shape=${shape}`);
	if (saturation) queryParams.push(`sat=${saturation}`);
	if (blur) queryParams.push(`blur=${blur}`);
	if (cacheBust !== null) queryParams.push(`n=${cacheBust}`);

	if (queryParams.length > 0) {
		imgUrl += '?' + queryParams.join('&');
	}
</script>

<img src={imgUrl} alt={shape} height="{height}px" width="{width}px" {...$$restProps} />
