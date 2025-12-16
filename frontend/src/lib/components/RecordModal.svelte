<script lang="ts">
	import { finance } from '$lib/state.svelte';
	import { X } from 'lucide-svelte';
	import type { Record } from '$lib/api';
	import { SvelteDate } from 'svelte/reactivity';

	let {
		close,
		initialData = null
	}: {
		close: () => void;
		initialData: Record | null;
	} = $props();
	let type = $state<'INCOME' | 'EXPENSE'>(initialData?.type ?? 'EXPENSE');
	let amount = $state(initialData?.amount ?? '');
	let accountId = $state(initialData?.accountId ?? finance.accounts[0]?.id);
	let date = $state(
		initialData?.date ? initialData.date.split('T')[0] : new Date().toISOString().split('T')[0]
	);
	let isSubmitting = $state(false);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!amount || !accountId) {
			return;
		}

		isSubmitting = true;
		try {
			if (initialData) {
				const payload = {};

				if (initialData.type !== type) {
					Object.assign(payload, { type });
				}
				if (initialData.amount !== amount) {
					Object.assign(payload, { amount: Number(amount) });
				}
				if (initialData.accountId !== accountId) {
					Object.assign(payload, { accountId });
				}
				if (initialData.date.split('T')[0] !== date) {
					Object.assign(payload, { date: new SvelteDate(date).toISOString() });
				}
				if (Object.keys(payload).length === 0) {
					close();
					return;
				}

				await finance.updateRecord(initialData.id, payload);
			} else {
				await finance.addRecord({
					type,
					accountId,
					amount: Number(amount),
					date: new SvelteDate(date).toISOString()
				});
			}
			close();
		} catch (err) {
			console.error(err);
			alert('Operation failed.');
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4" role="dialog">
	<div
		class="absolute inset-0 bg-black/60 backdrop-blur-sm"
		onclick={close}
		aria-hidden="true"
	></div>

	<form
		onsubmit={handleSubmit}
		class="relative w-full sm:max-w-md bg-zinc-900 rounded-t-3xl sm:rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-200 flex flex-col max-h-[90vh]"
	>
		<div class="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950/50">
			<h3 class="font-bold text-lg text-zinc-100">
				{initialData ? 'Edit Transaction' : 'New Transaction'}
			</h3>

			<button
				type="button"
				onclick={close}
				class="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800"
			>
				<X size={20} />
			</button>
		</div>

		<div class="p-5 space-y-6 overflow-y-auto">
			<!-- Type Switch -->
			<div class="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800">
				<button
					type="button"
					class="flex-1 py-2 rounded-lg text-sm font-bold transition-all {type === 'EXPENSE'
						? 'bg-zinc-800 text-rose-400 shadow-sm'
						: 'text-zinc-500 hover:text-zinc-300'}"
					onclick={() => (type = 'EXPENSE')}
				>
					Expense
				</button>
				<button
					type="button"
					class="flex-1 py-2 rounded-lg text-sm font-bold transition-all {type === 'INCOME'
						? 'bg-zinc-800 text-emerald-400 shadow-sm'
						: 'text-zinc-500 hover:text-zinc-300'}"
					onclick={() => (type = 'INCOME')}
				>
					Income
				</button>
			</div>

			<!-- Amount -->
			<div>
				<label class="block text-xs font-bold text-zinc-500 uppercase mb-2" for="amount">
					Amount
				</label>

				<div class="relative">
					<span class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-xl">
						$
					</span>

					<input
						id="amount"
						type="number"
						bind:value={amount}
						class="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 pl-10 pr-4 text-3xl font-bold font-mono focus:outline-none focus:border-indigo-500 text-white placeholder:text-zinc-700 transition-colors"
						placeholder="0"
					/>
				</div>
			</div>

			<!-- Details -->
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label class="block text-xs font-bold text-zinc-500 uppercase mb-2" for="date">
						Date
					</label>

					<input
						id="date"
						type="date"
						bind:value={date}
						class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
					/>
				</div>

				<div>
					<label class="block text-xs font-bold text-zinc-500 uppercase mb-2" for="account">
						Account
					</label>

					<select
						id="account"
						bind:value={accountId}
						class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none transition-colors"
					>
						{#each finance.accounts as acc}
							<option value={acc.id}>{acc.name}</option>
						{/each}
					</select>
				</div>
			</div>
		</div>

		<!-- Footer -->
		<div class="p-4 bg-zinc-950/50 border-t border-zinc-800 flex gap-3">
			<button
				type="submit"
				disabled={isSubmitting}
				class="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
			>
				{initialData ? 'Save Changes' : 'Add Record'}
			</button>
		</div>
	</form>
</div>
