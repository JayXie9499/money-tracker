export function isBigInt(val: string) {
	try {
		BigInt(val);
		return true;
	} catch {
		return false;
	}
}
