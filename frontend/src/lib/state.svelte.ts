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
		} catch (err) {
			console.error(err);
		}
	}

	async createAccount(data: Omit<Account, 'id'>) {
		try {
			const res = await api.accounts.create(data);
			this.accounts.push(res.data);
		} catch (err) {
			console.error(err);
		}
	}

	async updateAccount(id: number, data: { name: string; defaultBalance: number }) {
		try {
			const res = await api.accounts.update(id, data);
			const index = this.accounts.findIndex((a) => a.id === id);

			if (index !== -1) {
				Object.assign(this.accounts[index], res.data);
			}
		} catch (err) {
			console.error(err);
		}
	}

	async deleteAccount(id: number) {
		try {
			await api.accounts.remove(id);
			this.accounts = this.accounts.filter((a) => a.id !== id);

			if (this.selectedAccountId === id) {
				this.selectedAccountId = this.accounts.length ? this.accounts[0].id : undefined;
				await this.fetchRecords();
			}
		} catch (err) {
			console.error(err);
		}
	}

	async fetchRecords() {
		if (!this.selectedAccountId) {
			this.records = [];
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
		} catch (err) {
			console.error(err);
		} finally {
			this.loading = false;
		}
	}

	async addRecord(data: Omit<Record, 'id'>) {
		try {
			const res = await api.records.create(data);

			this.records.unshift(res.data);
			await this.fetchAccounts();
		} catch (err) {
			console.error(err);
		}
	}

	async deleteRecord(id: string) {
		try {
			await api.records.remove(id);
			this.records = this.records.filter((r) => r.id !== id);
			await this.fetchAccounts();
		} catch (err) {
			console.error(err);
		}
	}

	async updateRecord(id: string, data: Partial<Omit<Record, 'id'>>) {
		try {
			const res = await api.records.update(id, data);
			const index = this.records.findIndex((r) => r.id === id);

			if (index !== -1) {
				this.records[index] = res.data;
			}

			await this.fetchAccounts();
		} catch (err) {
			console.error(err);
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
