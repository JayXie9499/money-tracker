<script lang="ts">
	let {
		name,
		balance,
		isActive = false,
		onclick
	} = $props<{
		name: string;
		balance: number;
		isActive?: boolean;
		onclick?: () => void;
	}>();

	const activeStyles =
		'bg-emerald-600 border-emerald-500 shadow-lg shadow-emerald-900/40 ring-emerald-500';
	const inactiveStyles = 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/80';
	const displayAmount = $derived(
		new Intl.NumberFormat('zh-TW', {
			style: 'currency',
			currency: 'TWD',
			maximumFractionDigits: 0
		}).format(balance)
	);
</script>

<button
	class="
    snap-center shrink-0 w-40 p-4 h-28 rounded-2xl border transition-all duration-300
    flex flex-col justify-between text-left relative overflow-hidden group outline-none
    focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950
    {isActive ? `${activeStyles} scale-[1.02]` : inactiveStyles}
  "
	{onclick}
	type="button"
>
	<!-- Decorative background glow (shown only when Active) -->
	{#if isActive}
		<div
			class="absolute -top-2 -right-2 w-20 h-20 bg-white/10 blur-2xl rounded-full pointer-events-none"
		></div>
	{/if}

	<!-- Title section -->
	<div class="flex items-center gap-2 z-10 w-full">
		<span
			class="text-sm font-medium truncate w-full {isActive
				? 'text-white/90'
				: 'text-zinc-400 group-hover:text-zinc-300'}"
		>
			{name}
		</span>
	</div>

	<!-- Amount section -->
	<div class="z-10">
		<span
			class="text-[10px] uppercase tracking-wider font-bold mb-0.5 block {isActive
				? 'text-indigo-100/60'
				: 'text-zinc-600'}"
		>
			Balance
		</span>

		<span
			class="text-xl font-bold font-mono tracking-tight {isActive ? 'text-white' : 'text-zinc-200'}"
		>
			{displayAmount}
		</span>
	</div>
</button>
