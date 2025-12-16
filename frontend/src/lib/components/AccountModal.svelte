<script lang="ts">
	import { finance } from '$lib/state.svelte';
	import { X, Wallet } from 'lucide-svelte';

	let { close }: { close: () => void } = $props();
	let name = $state('');
	let balance = $state('');
	let isSubmitting = $state(false);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!name) {
			return;
		}

		isSubmitting = true;
		try {
			await finance.createAccount({ name, defaultBalance: Number(balance) || 0 });
			close();
		} catch (err) {
			alert('Unable to create account, please check if the name is duplicated');
			console.error(err);
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog">
	<!-- Backdrop -->
	<div
		class="absolute inset-0 bg-black/60 backdrop-blur-sm"
		onclick={close}
		aria-hidden="true"
	></div>

	<!-- Content -->
	<form
		onsubmit={handleSubmit}
		class="relative w-full max-w-sm bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
	>
		<div class="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950/50">
			<h3 class="font-bold text-zinc-100 flex items-center gap-2">
				<Wallet size={18} class="text-indigo-500" />
				New Account
			</h3>

			<button
				type="button"
				onclick={close}
				class="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
			>
				<X size={18} />
			</button>
		</div>

		<div class="p-5 space-y-5">
			<!-- Account Name -->
			<div>
				<label class="block text-xs font-bold text-zinc-500 uppercase mb-2" for="acc-name">
					Account Name
				</label>

				<input
					id="acc-name"
					type="text"
					bind:value={name}
					class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500 transition-colors"
					placeholder="e.g. Credit Card, Cash"
					required
				/>
			</div>

			<!-- Initial Balance -->
			<div>
				<label class="block text-xs font-bold text-zinc-500 uppercase mb-2" for="acc-balance">
					Initial Balance
				</label>

				<div class="relative">
					<span class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-mono">$</span>

					<input
						id="acc-balance"
						type="number"
						bind:value={balance}
						class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 pl-7 text-white placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
						placeholder="0"
					/>
				</div>

				<p class="text-[10px] text-zinc-600 mt-1.5 ml-1">Current balance of the account.</p>
			</div>
		</div>

		<div class="p-4 border-t border-zinc-800 flex justify-end gap-3 bg-zinc-950/30">
			<button
				type="button"
				onclick={close}
				class="px-4 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
			>
				Cancel
			</button>

			<button
				type="submit"
				disabled={isSubmitting}
				class="px-6 py-2 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{isSubmitting ? 'Creating...' : 'Create Account'}
			</button>
		</div>
	</form>
</div>
