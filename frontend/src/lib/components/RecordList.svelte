<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import { finance } from '$lib/state.svelte';
	import { Trash2, TrendingUp, TrendingDown, Pencil } from 'lucide-svelte';
	import type { Record } from '$lib/api';

	let { onEdit }: { onEdit: (r: Record) => void } = $props();
	let selectedIds = $state(new Set<string>());

	function toggleSelect(id: string) {
		const next = new SvelteSet(selectedIds);

		if (next.has(id)) {
			next.delete(id);
		} else {
			next.add(id);
		}

		selectedIds = next;
	}

	async function batchDelete() {
		if (!confirm(`Delete ${selectedIds.size} record(s)?`)) {
			return;
		}

		await Promise.all(Array.from(selectedIds).map((id) => finance.deleteRecord(id)));
		selectedIds = new Set();
	}

	function groupByDate(records: Record[]) {
		const groups: { [key: string]: Record[] } = {};

		for (const r of records) {
			const d = r.date.split('T')[0];

			if (!groups[d]) {
				groups[d] = [];
			}

			groups[d].push(r);
		}
		return groups;
	}
</script>

{#if selectedIds.size > 0}
	<div
		class="fixed bottom-24 left-1/2 -translate-x-1/2 z-30 animate-in slide-in-from-bottom-4 fade-in"
	>
		<button
			onclick={batchDelete}
			class="bg-rose-600 text-white px-6 py-2 rounded-full shadow-lg flex items-center gap-2 font-bold text-sm"
		>
			<Trash2 size={16} /> Delete ({selectedIds.size})
		</button>
	</div>
{/if}

<div class="space-y-6 pb-20">
	{#each Object.entries(groupByDate(finance.filteredRecords)) as [date, items] (date)}
		<div>
			<div
				class="sticky top-16 bg-zinc-950/90 backdrop-blur py-2 z-10 text-xs font-mono text-zinc-500 border-b border-zinc-800/50 mb-2"
			>
				{date}
			</div>

			<div class="space-y-2">
				{#each items as record (record.id)}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						class="group relative flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer
							{selectedIds.has(record.id)
							? 'bg-zinc-800 border-indigo-500/50'
							: 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900'}"
						onclick={() => toggleSelect(record.id)}
					>
						<!-- Checkbox Indicator -->
						<div
							class="w-1 h-full absolute left-0 top-0 rounded-l-xl transition-colors
							{selectedIds.has(record.id) ? 'bg-indigo-500' : 'bg-transparent'}"
						></div>

						<!-- Icon -->
						<div
							class="w-10 h-10 rounded-full flex items-center justify-center shrink-0
							{record.type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}"
						>
							{#if record.type === 'INCOME'}
								<TrendingUp size={18} />
							{:else}
								<TrendingDown size={18} />
							{/if}
						</div>

						<!-- Content -->
						<div class="flex-1">
							<div class="flex justify-between items-baseline">
								<span class="text-zinc-300 font-medium">
									{finance.accounts.find((a) => a.id === record.accountId)?.name || 'Unknown'}
								</span>

								<span
									class="font-mono font-bold {record.type === 'INCOME'
										? 'text-emerald-400'
										: 'text-zinc-200'}"
								>
									{record.type === 'INCOME' ? '+' : '-'}{record.amount}
								</span>
							</div>
						</div>

						<!-- Edit Button -->
						<button
							type="button"
							onclick={(e) => {
								e.stopPropagation();
								onEdit(record);
							}}
							class="
								p-2 rounded-lg text-zinc-500
								hover:text-white hover:bg-zinc-700
								active:bg-zinc-600 active:scale-95
								transition-all duration-200
								opacity-100 sm:opacity-0 sm:group-hover:opacity-100
								focus:opacity-100 focus:outline-none
							"
							aria-label="Edit record"
						>
							<Pencil size={16} />
						</button>
					</div>
				{/each}
			</div>
		</div>
	{/each}

	{#if finance.records.length === 0 && !finance.loading}
		<div class="text-center text-zinc-600 py-10">No records found</div>
	{/if}
</div>
