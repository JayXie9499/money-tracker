<script lang="ts">
	import { finance } from '$lib/state.svelte';
	import AccountCard from '$lib/components/AccountCard.svelte';
	import AccountAddCard from '$lib/components/AccountAddCard.svelte';
	import AccountModal from '$lib/components/AccountModal.svelte';
	import RecordList from '$lib/components/RecordList.svelte';
	import RecordModal from '$lib/components/RecordModal.svelte';
	import { Plus, ChevronLeft, ChevronRight } from 'lucide-svelte';

	let isRecordModalOpen = $state(false);
	let isAccountModalOpen = $state(false);
	const dateDisplay = $derived(
		finance.currentDate.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' })
	);
</script>

<div class="min-h-screen bg-zinc-950 text-zinc-100 font-sans pb-20">
	<!-- Header / Filter -->
	<header class="sticky top-0 z-20 bg-zinc-950/80 backdrop-blur border-b border-zinc-800 p-4">
		<div class="max-w-md mx-auto flex items-center justify-between">
			<button onclick={() => finance.setMonth(-1)} class="p-2 hover:bg-zinc-800 rounded-full">
				<ChevronLeft size={20} />
			</button>

			<h1 class="font-bold text-lg">{dateDisplay}</h1>

			<button onclick={() => finance.setMonth(1)} class="p-2 hover:bg-zinc-800 rounded-full">
				<ChevronRight size={20} />
			</button>
		</div>
	</header>

	<main class="max-w-md mx-auto p-4 space-y-6">
		<!-- 帳戶區塊 -->
		<section>
			<h2 class="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Accounts</h2>

			<div class="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar">
				{#each finance.accounts as account (account.id)}
					<AccountCard
						name={account.name}
						balance={Number(account.defaultBalance) +
							Number(account.totalIncome) -
							Number(account.totalExpense)}
						isActive={finance.selectedAccountId === account.id}
						onclick={() => finance.selectAccount(account.id)}
					/>
				{/each}

				<AccountAddCard onclick={() => (isAccountModalOpen = true)} />
			</div>
		</section>

		<!-- 紀錄列表 -->
		<section>
			<div class="flex justify-between items-end mb-3">
				<h2 class="text-xs font-bold text-zinc-500 uppercase tracking-wider">Transactions</h2>

				<span class="text-xs text-zinc-600">
					{finance.loading ? 'Loading...' : `${finance.records.length} records`}
				</span>
			</div>

			<RecordList />
		</section>
	</main>

	<!-- FAB -->
	<button
		onclick={() => (isRecordModalOpen = true)}
		class="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg shadow-indigo-900/50 flex items-center justify-center z-30 transition-transform active:scale-90"
	>
		<Plus size={28} />
	</button>

	<!-- Modal -->
	{#if isRecordModalOpen}
		<RecordModal close={() => (isRecordModalOpen = false)} />
	{/if}

	{#if isAccountModalOpen}
		<AccountModal close={() => (isAccountModalOpen = false)} />
	{/if}
</div>

<style>
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
