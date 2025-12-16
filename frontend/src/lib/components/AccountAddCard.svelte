<script lang="ts">
	import { Plus } from 'lucide-svelte';

	let { onclick }: { onclick: () => void } = $props();
</script>

<button
	{onclick}
	type="button"
	class="
		snap-center shrink-0 w-16 h-28 rounded-2xl
		border-2 border-dashed border-zinc-800/80
		hover:border-zinc-600 hover:bg-zinc-900/30
		active:scale-95 active:bg-zinc-900/50
		transition-all duration-300
		flex flex-col items-center justify-center gap-2
		group outline-none cursor-pointer
		focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus-visible:ring-zinc-700
	"
	aria-label="Create new account"
>
	<!-- Icon Circle -->
	<div
		class="
			w-10 h-10 rounded-full
			bg-zinc-900 border border-zinc-800
			flex items-center justify-center
			group-hover:border-zinc-600 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-black/20
			transition-all duration-300
		"
	>
		<Plus size={20} class="text-zinc-500 group-hover:text-zinc-300 transition-colors" />
	</div>

	<!-- Label -->
	<span
		class="text-[10px] font-bold uppercase tracking-wider text-zinc-600 group-hover:text-zinc-400 transition-colors"
	>
		Add
	</span>
</button>
