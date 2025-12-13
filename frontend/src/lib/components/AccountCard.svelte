<script lang="ts">
	import { Trash2 } from 'lucide-svelte';

	let {
		name,
		balance,
		isActive = false,
		onclick,
		onDelete
	}: {
		name: string;
		balance: number;
		isActive?: boolean;
		onclick?: () => void;
		onDelete: () => void;
	} = $props();

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

<div class="relative group/card snap-center shrink-0">
	<button
		class="
      w-40 p-4 h-28 rounded-2xl border transition-all duration-300
      flex flex-col justify-between text-left relative overflow-hidden outline-none
      focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950
      {isActive ? `${activeStyles} scale-[1.02]` : inactiveStyles}
    "
		{onclick}
		type="button"
	>
		{#if isActive}
			<div
				class="absolute -top-2 -right-2 w-20 h-20 bg-white/10 blur-2xl rounded-full pointer-events-none"
			></div>
		{/if}

		<div class="flex items-center gap-2 z-10 w-full">
			<span
				class="text-sm font-medium truncate w-full pr-6 {isActive
					? 'text-white/90'
					: 'text-zinc-400 group-hover/card:text-zinc-300'}"
			>
				{name}
			</span>
		</div>

		<div class="z-10">
			<span
				class="text-[10px] uppercase tracking-wider font-bold mb-0.5 block {isActive
					? 'text-indigo-100/60'
					: 'text-zinc-600'}"
			>
				Balance
			</span>

			<span
				class="text-xl font-bold font-mono tracking-tight {isActive
					? 'text-white'
					: 'text-zinc-200'}"
			>
				{displayAmount}
			</span>
		</div>
	</button>

	<button
		type="button"
		onclick={(e) => {
			e.stopPropagation();
			onDelete();
		}}
		class="
        absolute top-2 right-2 p-1.5 rounded-full z-20
        transition-all duration-200
        opacity-100 sm:opacity-0 sm:group-hover/card:opacity-100
        {isActive
			? 'text-white/50 hover:text-white hover:bg-rose-500/40'
			: 'text-zinc-600 hover:text-rose-400 hover:bg-zinc-800'}
      "
		aria-label="Delete Account"
		title="Delete Account"
	>
		<Trash2 size={14} />
	</button>
</div>
