import { SvelteDate } from 'svelte/reactivity';
import { api, type Account, type AccountWithTotals, type Record } from './api';

class FinanceApp {
	accounts = $state<AccountWithTotals[]>([]);
	records = $state<Record[]>([]);
	selectedAccountId = $state<number>();
	currentDate = $state(new SvelteDate());
	loading = $state(false);

	constructor() {
		this.init();
	}

	async init() {
		await this.fetchAccounts();

		if (this.accounts.length) {
			this.selectAccount(this.accounts[0].id);
		}
	}

	get filteredRecords() {
		return this.records
			.slice()
			.sort((a, b) => new SvelteDate(b.date).getTime() - new SvelteDate(a.date).getTime());
	}

	async fetchAccounts() {
		try {
			const res = await api.accounts.list();
			this.accounts = res.data.sort((a, b) => a.id - b.id);
		} catch (e) {
			console.error(e);
		}
	}

	async createAccount(data: Omit<Account, 'id'>) {
		try {
			const res = await api.accounts.create(data);
			this.accounts.push(res.data);
		} catch (e) {
			console.error(e);
		}
	}

	async fetchRecords() {
		if (!this.selectedAccountId) {
			return;
		}

		this.loading = true;
		try {
			const year = this.currentDate.getFullYear();
			const month = this.currentDate.getMonth() + 1;
			const res = await api.records.list({
				year,
				month,
				accountId: this.selectedAccountId
			});

			this.records = res.data;
		} catch (e) {
			console.error(e);
		} finally {
			this.loading = false;
		}
	}

	async addRecord(data: Omit<Record, 'id'>) {
		try {
			const res = await api.records.create(data);

			this.records.unshift(res.data);
			await this.fetchAccounts();
		} catch (e) {
			console.error(e);
		}
	}

	async deleteRecord(id: string) {
		try {
			await api.records.remove(id);
			this.records = this.records.filter((r) => r.id !== id);
			await this.fetchAccounts();
		} catch (e) {
			console.error(e);
		}
	}

	setMonth(offset: number) {
		const newDate = new SvelteDate(
			this.currentDate.getFullYear(),
			this.currentDate.getMonth() + offset,
			1
		);

		this.currentDate = newDate;
		this.fetchRecords();
	}

	selectAccount(id: number) {
		this.selectedAccountId = id;
		this.fetchRecords();
	}
}

export const finance = new FinanceApp();
