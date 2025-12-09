import { PUBLIC_API_URL } from '$env/static/public';

export interface Account {
	id: number;
	name: string;
	defaultBalance: string | number;
}

export type AccountWithTotals = Account & {
	totalIncome: string;
	totalExpense: string;
};

export interface Record {
	id: string;
	type: 'INCOME' | 'EXPENSE';
	accountId: number;
	amount: string | number;
	date: string;
}

async function send<T>(
	method: string,
	path: string,
	data?: object
): Promise<{ message: string; data: T }> {
	const opts: RequestInit = { method };
	if (data) {
		opts.headers = { 'Content-Type': 'application/json' };
		opts.body = JSON.stringify(data);
	}

	const res = await fetch(`${PUBLIC_API_URL}${path}`, opts);

	if (!res.ok) {
		throw new Error(`API Error: ${res.statusText}`);
	}

	const json = await res.json();

	return {
		message: json.message,
		data: json.data ? JSON.parse(json.data) : undefined
	};
}

export const api = {
	accounts: {
		list: () => send<AccountWithTotals[]>('GET', '/accounts'),
		create: (body: Omit<Account, 'id'>) => send<AccountWithTotals>('POST', '/accounts', body),
		update: (id: number, body: Partial<Omit<Account, 'id'>>) =>
			send<Account>('PUT', `/accounts/${id}`, body),
		remove: (id: number) => send<void>('DELETE', `/accounts/${id}`)
	},
	records: {
		list: (query: { accountId: number; year: number; month: number }) => {
			const params = new URLSearchParams();

			params.append('accountId', query.accountId.toString());
			params.append('year', query.year.toString());
			params.append('month', query.month.toString());
			return send<Record[]>('GET', `/records?${params.toString()}`);
		},
		create: (body: Omit<Record, 'id'>) => send<Record>('POST', '/records', body),
		update: (id: string, body: Partial<Omit<Record, 'id'>>) =>
			send<Record>('PUT', `/records/${id}`, body),
		remove: (id: string) => send<void>('DELETE', `/records/${id}`)
	}
};
